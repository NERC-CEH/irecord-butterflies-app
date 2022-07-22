import { FC, useContext, SyntheticEvent } from 'react';
import { useAlert, date, useToast } from '@flumens';
import Sample, { useValidateCheck } from 'models/sample';
import Occurrence from 'models/occurrence';
import { useUserStatusCheck } from 'models/user';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
  IonIcon,
  IonAvatar,
  NavContext,
} from '@ionic/react';
import clsx from 'clsx';
import species, { Species } from 'common/data/species';
import getFormattedDuration from 'common/helpers/getFormattedDuration';
import VerificationListIcon from 'common/Components/VerificationListIcon';
import VerificationIcon from 'common/Components/VerificationIcon';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import OnlineStatus from './components/OnlineStatus';
import ErrorMessage from './components/ErrorMessage';
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

  const prettyDate = date.print(sample.attrs.date);
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

    const image = occ.media[0];
    let avatar = <IonIcon icon={butterflyIcon} color="warning" />;

    if (image) {
      avatar = <img src={image.getURL()} />;
    } else if (thumbnail) {
      avatar = <img src={thumbnail} />;
    }

    return (
      <>
        <IonAvatar>{avatar}</IonAvatar>

        <IonLabel position="stacked" mode="ios" color="dark">
          <IonLabel className="species-name" color={clsx(!label && 'warning')}>
            {label || 'Species missing'}
          </IonLabel>
          <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
          {isOutsideUK && (
            <IonBadge className="location-warning" color="warning">
              Check location
            </IonBadge>
          )}
        </IonLabel>
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
      <IonBadge>
        Time: <b>{durationTime}</b>
      </IonBadge>
    ) : null;

    return (
      <>
        <IonAvatar>{avatar}</IonAvatar>
        <IonLabel position="stacked" mode="ios" color="dark">
          <IonLabel className="species-name">
            {label || 'Species missing'}
          </IonLabel>
          <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
          <div className="badge-wrapper">
            {!!count && (
              <IonBadge>
                Count: <b>{count}</b>
              </IonBadge>
            )}
            {showSurveyDuration}
          </div>
        </IonLabel>
      </>
    );
  }

  if (sample.isSurveyMultiSpeciesTimedCount()) {
    const speciesCount = sample.samples.length;

    const durationTime = (
      <span>{getFormattedDuration(sample.attrs.duration)}</span>
    );

    const showSurveyDuration = sample.metadata.saved ? (
      <IonBadge>
        Time: <b>{durationTime}</b>
      </IonBadge>
    ) : null;

    return (
      <>
        <div className="count">
          <div className="number">{speciesCount}</div>
          <div className="label">Count</div>
        </div>
        <IonLabel position="stacked" mode="ios" color="dark">
          <IonLabel className="species-name">Multi timed count</IonLabel>
          <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
          <div className="badge-wrapper">{showSurveyDuration}</div>
        </IonLabel>
      </>
    );
  }

  const speciesCount = sample.occurrences.length;
  const location = sample.attrs.location || {};
  const locationName = location.name || 'List';

  return (
    <>
      <div className="count">
        <div className="number">{speciesCount}</div>
        <div className="label">Species</div>
      </div>

      <IonLabel position="stacked" mode="ios" color="dark">
        <IonLabel className="location-name">{locationName}</IonLabel>
        <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
        {isOutsideUK && (
          <IonBadge className="location-warning" color="warning">
            Check location
          </IonBadge>
        )}
      </IonLabel>
    </>
  );
}

interface Props {
  sample: Sample;
  uploadIsPrimary?: boolean;
  style?: any;
}

const Survey: FC<Props> = ({ sample, uploadIsPrimary, ...props }) => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const deleteSurvey = useSurveyDeletePrompt(sample);
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();

  const { synchronising } = sample.remote;

  const href = !synchronising ? sample.getCurrentEditRoute() : undefined;

  const deleteSurveyWrap = () => deleteSurvey();
  const onUpload = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <IonItemSliding class="survey-list-item" {...props}>
      <ErrorMessage sample={sample} />

      <IonItem
        routerLink={href}
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
