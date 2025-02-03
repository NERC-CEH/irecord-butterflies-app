import { useContext } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { timeOutline } from 'ionicons/icons';
import { Badge, getRelativeDate, useAlert, useToast } from '@flumens';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonAvatar,
  NavContext,
} from '@ionic/react';
import VerificationIcon from 'common/Components/VerificationIcon';
import VerificationListIcon from 'common/Components/VerificationListIcon';
import species, { Species } from 'common/data/species';
import getFormattedDuration from 'common/helpers/getFormattedDuration';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import OnlineStatus from './components/OnlineStatus';
import './styles.scss';

function useSurveyDeletePrompt(sample: Sample) {
  const alert = useAlert();

  const promptSurveyDelete = () =>
    alert({
      header: 'Delete',
      message: 'Are you sure you want to delete this survey?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => sample.destroy(),
        },
      ],
    });

  return promptSurveyDelete;
}

function getSampleInfo(sample: Sample) {
  const survey = sample.getSurvey();

  const prettyDate = getRelativeDate(sample.attrs.date);
  const isOutsideUK = sample.attrs.location && !sample.attrs.location.gridref;

  if (survey.name === 'point') {
    const occ = sample.occurrences[0];
    if (!occ) {
      console.error('No occurrence found when showing record');
      // TODO: remove this check after Beta
      sample.destroy();
      return null;
    }

    const taxon = occ.attrs.taxon || {};
    const label = taxon.commonName;

    const byId = ({ id: speciesID }: Species) => speciesID === taxon.id;
    const fullSpeciesProfile: any = species.find(byId) || {};

    const { thumbnail } = fullSpeciesProfile;

    let avatar = <IonIcon icon={butterflyIcon} color="warning" />;
    if (occ.media.length) {
      const image = occ.media[0];
      avatar = <img src={image.getURL()} />;
    } else if (thumbnail) {
      avatar = <img src={thumbnail} />;
    }

    return (
      <>
        <IonAvatar className="shrink-0">{avatar}</IonAvatar>

        <div className="flex w-full flex-col">
          <div className={clsx('species-name', !label && 'text-warning')}>
            {label || 'Species missing'}
          </div>

          <div className="text-sm">{prettyDate}</div>

          {isOutsideUK && (
            <Badge color="warning" size="small">
              Check location
            </Badge>
          )}
        </div>
      </>
    );
  }

  if (sample.isSurveySingleSpeciesTimedCount()) {
    const occ = sample?.samples[0]?.occurrences[0];

    const nonZeroAbundance = (smp: Sample) =>
      !smp?.occurrences[0]?.hasZeroAbundance();
    const count = sample?.samples?.filter(nonZeroAbundance).length;

    const taxon = occ?.attrs?.taxon || {};
    const label = 'Single timed count';

    const byId = ({ id: speciesID }: Species) => speciesID === taxon.id;
    const fullSpeciesProfile: any = species.find(byId) || {};

    const { thumbnail } = fullSpeciesProfile;

    const image = occ?.media[0];
    let avatar = <IonIcon icon={butterflyIcon} color="warning" />;

    if (image) {
      avatar = <img src={image.getURL()} />;
    } else if (thumbnail) {
      avatar = <img src={thumbnail} />;
    }

    const durationTime = (
      <span>{getFormattedDuration(sample.attrs.duration)}</span>
    );

    const showSurveyDuration = sample.metadata.saved ? (
      <Badge className="ml-1" prefix={<IonIcon src={timeOutline} />}>
        {durationTime}
      </Badge>
    ) : null;

    return (
      <>
        <IonAvatar className="shrink-0">{avatar}</IonAvatar>

        <div className="flex w-full flex-col">
          <div className={clsx('species-name', !label && 'text-warning')}>
            {label || 'Species missing'}
          </div>
          <div>
            <div className="text-sm">
              {prettyDate}

              {!!count && (
                <Badge
                  skipTranslation
                  className="ml-1"
                  prefix={<IonIcon src={butterflyIcon} />}
                >
                  {count}
                </Badge>
              )}
              {showSurveyDuration}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (sample.isSurveyMultiSpeciesTimedCount()) {
    const speciesCount = sample.samples.length;

    const durationTime = (
      <span>{getFormattedDuration(sample.attrs.duration)}</span>
    );

    const showSurveyDuration = sample.metadata.saved ? (
      <Badge className="ml-1" prefix={<IonIcon src={timeOutline} />}>
        {durationTime}
      </Badge>
    ) : null;

    return (
      <>
        <div className="count">
          <div className="number">{speciesCount}</div>
          <div className="label">Count</div>
        </div>
        <div className="flex flex-col">
          <div className="species-name">Multi timed count</div>
          <div className="text-sm">{prettyDate}</div>
          <div className="badge-wrapper">{showSurveyDuration}</div>
        </div>
      </>
    );
  }

  const speciesCount = sample.occurrences.length;
  const location = sample.attrs.location || {};
  const locationName = location.name || 'List';

  return (
    <>
      <div className="count shrink-0">
        <div className="number">{speciesCount}</div>
        <div className="label">Species</div>
      </div>

      <div className="flex w-full flex-col">
        <div className="location-name">{locationName}</div>
        <div className="text-sm">{prettyDate}</div>
        {isOutsideUK && (
          <Badge color="warning" size="small">
            Check location
          </Badge>
        )}
      </div>
    </>
  );
}

interface Props {
  sample: Sample;
  uploadIsPrimary?: boolean;
  style?: any;
}

const Survey = ({ sample, uploadIsPrimary, ...props }: Props) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const deleteSurvey = useSurveyDeletePrompt(sample);
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();

  const { synchronising } = sample.remote;

  const href = !synchronising ? sample.getCurrentEditRoute() : undefined;

  const deleteSurveyWrap = () => deleteSurvey();
  const onUpload = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    sample.upload().catch(toast.error);
    navigate(`/home/surveys`, 'root');
  };

  const getVerificationIconForPointSurvey = (occ: Occurrence) => (
    <VerificationIcon occ={occ} key={occ.cid} />
  );

  const verificationIcon =
    sample.metadata.survey === 'point' ? (
      sample.occurrences.map(getVerificationIconForPointSurvey)
    ) : (
      <VerificationListIcon sample={sample} key={sample.cid} />
    );

  const openItem = () => {
    if (sample.remote.synchronising) return; // fixes button onPressUp and other accidental navigation
    navigate(href!);
  };

  return (
    <IonItemSliding class="survey-list-item" {...props}>
      <IonItem
        onClick={openItem}
        detail={!synchronising && !sample.hasOccurrencesBeenVerified()}
      >
        {getSampleInfo(sample)}

        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={uploadIsPrimary}
        />

        {verificationIcon}
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteSurveyWrap}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default observer(Survey);
