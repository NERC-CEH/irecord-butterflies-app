import React, { FC, useContext, SyntheticEvent } from 'react';
import { alert, date } from '@apps';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import UserModelProps from 'models/user';
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

function deleteSurvey(sample: typeof Sample) {
  alert({
    header: 'Delete',
    message: 'Are you sure you want to delete this survey?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: 'Delete',
        cssClass: 'secondary',
        handler: () => sample.destroy(),
      },
    ],
  });
}

function getSampleInfo(sample: typeof Sample) {
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

  if (survey.name === 'single-species-count') {
    const occ = sample?.samples[0]?.occurrences[0];

    const count = sample?.samples?.length;

    const taxon = occ?.attrs?.taxon || {};
    const label = 'Timed count';

    const byId = ({ id: speciesID }: Species) => speciesID === taxon.id;
    const fullSpeciesProfile: any = species.find(byId) || {};

    const { thumbnail } = fullSpeciesProfile;

    const image = occ?.media[0];
    let avatar = <IonIcon icon={thumbnail} color="warning" />;

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
            {!!count && !sample.hasZeroAbundance() && (
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
  sample: typeof Sample;
  userModel: typeof UserModelProps;
  uploadIsPrimary?: boolean;
}

const Survey: FC<Props> = ({ sample, userModel, uploadIsPrimary }) => {
  const { navigate } = useContext(NavContext);

  const { synchronising } = sample.remote;

  const href = !synchronising ? sample.getCurrentEditRoute() : undefined;

  const deleteSurveyWrap = () => deleteSurvey(sample);
  const onUpload = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      navigate(`/user/login`);
      return;
    }

    sample.upload();
    navigate(`/home/surveys`, 'root');
  };

  const getVerificationIconForPointSurvey = (occ: typeof Occurrence) => (
    <VerificationIcon occ={occ} key={occ.cid} />
  );

  const verificationIcon =
    sample.metadata.survey === 'point' ? (
      sample.occurrences.map(getVerificationIconForPointSurvey)
    ) : (
      <VerificationListIcon sample={sample} key={sample.cid} />
    );

  return (
    <IonItemSliding class="survey-list-item">
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
