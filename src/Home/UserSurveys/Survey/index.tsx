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
  NavContext,
} from '@ionic/react';
import VerificationListStatus from 'common/Components/VerificationListStatus';
import VerificationStatus from 'common/Components/VerificationStatus';
import species, { byIdsAndName } from 'common/data/species';
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

  const prettyDate = getRelativeDate(sample.data.date);
  const isOutsideUK = sample.data.location && !sample.data.location.gridref;

  if (survey.name === 'point') {
    const occ = sample.occurrences[0];
    if (!occ) return null; // in case occ is null when fetched from remote

    const taxon = occ.data.taxon || {};
    const label = taxon.commonName || taxon.scientificName;

    const fullSpeciesProfile: any = species.find(byIdsAndName(taxon)) || {};

    const { thumbnail } = fullSpeciesProfile;

    let avatar = (
      <IonIcon
        icon={butterflyIcon}
        className="size-7 [--ionicon-stroke-width:17px]"
      />
    );
    if (occ.media.length) {
      const image = occ.media[0];
      avatar = (
        <img src={image.getURL()} className="h-full w-full object-cover" />
      );
    } else if (thumbnail) {
      avatar = <img src={thumbnail} />;
    }

    return (
      <>
        <div className="list-avatar ml-2 mr-4">{avatar}</div>

        <div className="flex w-full flex-col">
          <div className={clsx('species-name', !label && 'text-warning')}>
            {label || 'Species missing'}
          </div>

          <div className="text-sm">{prettyDate}</div>

          {isOutsideUK && !sample.isDisabled && (
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

    const taxon = occ?.data?.taxon || {};

    const fullSpeciesProfile: any = species.find(byIdsAndName(taxon)) || {};

    const { thumbnail } = fullSpeciesProfile;

    const image = occ?.media[0];
    let avatar = (
      <IonIcon
        icon={butterflyIcon}
        className="size-7 [--ionicon-stroke-width:17px]"
      />
    );

    if (image) {
      avatar = (
        <img src={image.getURL()} className="h-full w-full object-cover" />
      );
    } else if (thumbnail) {
      avatar = <img src={thumbnail} />;
    }

    const { duration } = sample.data;
    const formattedDuration =
      typeof duration === 'string'
        ? duration // from remote
        : getFormattedDuration(duration);
    const durationTime = <span>{formattedDuration}</span>;

    const showSurveyDuration = sample.metadata.saved ? (
      <Badge className="ml-1" prefix={<IonIcon src={timeOutline} />}>
        {durationTime}
      </Badge>
    ) : null;

    return (
      <>
        <div className="list-avatar ml-2 mr-4 shrink-0">{avatar}</div>

        <div className="flex w-full flex-col">
          <div className="species-name">Single species count</div>
          <div className="flex items-center gap-1 text-sm">
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
      </>
    );
  }

  if (sample.isSurveyMultiSpeciesTimedCount()) {
    const speciesCount = sample.samples.length;

    return (
      <>
        <div className="my-2.5 ml-4 mr-6 shrink-0">
          <div className="mx-auto my-0 h-10 w-10 rounded-full bg-neutral-100 text-center leading-10">
            {speciesCount}
          </div>
          <div className="text-center text-xs">Count</div>
        </div>
        <div className="flex w-full flex-col">
          <div className="species-name">15-min count</div>
          <div className="text-sm">{prettyDate}</div>
          {isOutsideUK && !sample.isDisabled && (
            <Badge color="warning" size="small">
              Check location
            </Badge>
          )}
        </div>
      </>
    );
  }

  const speciesCount = sample.occurrences.length;
  const location = sample.data.location || {};
  const locationName = location.name || 'List';

  return (
    <>
      <div className="my-2.5 ml-4 mr-6 shrink-0">
        <div className="mx-auto my-0 h-10 w-10 rounded-full bg-neutral-100 text-center leading-10">
          {speciesCount}
        </div>
        <div className="text-center text-xs">Species</div>
      </div>

      <div className="flex w-full flex-col">
        <div className="location-name">{locationName}</div>
        <div className="text-sm">{prettyDate}</div>
        {isOutsideUK && !sample.isDisabled && (
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

  const href = !sample.isSynchronising
    ? sample.getCurrentEditRoute()
    : undefined;

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
    <VerificationStatus occ={occ} key={occ.cid} />
  );

  const verificationIcon =
    sample.getSurvey().name === 'point' ? (
      sample.occurrences.map(getVerificationIconForPointSurvey)
    ) : (
      <VerificationListStatus sample={sample} key={sample.cid} />
    );

  const allowDeletion = sample.isStored;

  const openItem = () => {
    if (sample.isSynchronising) return; // fixes button onPressUp and other accidental navigation
    navigate(href!);
  };

  return (
    <IonItemSliding class="survey-list-item" {...props}>
      <IonItem onClick={openItem} detail={false}>
        {getSampleInfo(sample)}

        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={uploadIsPrimary}
        />

        {verificationIcon}
      </IonItem>

      {allowDeletion && (
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={deleteSurveyWrap}>
            Delete
          </IonItemOption>
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default observer(Survey);
