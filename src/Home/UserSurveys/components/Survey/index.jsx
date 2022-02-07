import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { alert, date } from '@apps';
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
import species from 'common/data/species';
import getFormattedDuration from 'common/helpers/getFormattedDuration';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import OnlineStatus from './components/OnlineStatus';
import ErrorMessage from './components/ErrorMessage';
import './styles.scss';

function deleteSurvey(sample) {
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

function getSampleInfo(sample) {
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

    const byId = ({ id: speciesID }) => speciesID === taxon.id;
    const fullSpeciesProfile = species.find(byId) || {};

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
    const label = 'Time';

    const byId = ({ id: speciesID }) => speciesID === taxon.id;
    const fullSpeciesProfile = species.find(byId) || {};

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
      <IonBadge className="time-badge">Time: {durationTime}</IonBadge>
    ) : null;

    return (
      <>
        <IonAvatar>{avatar}</IonAvatar>
        <IonLabel position="stacked" mode="ios" color="dark">
          <IonLabel className="species-name">
            {label || 'Species missing'}
          </IonLabel>
          <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
          <div style={{ display: 'inline' }}>
            {!!count && !sample.hasZeroAbundance() && (
              <IonBadge className="occurrence-badge">Count: {count}</IonBadge>
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

const Survey = ({ sample, userModel, uploadIsPrimary }) => {
  const { navigate } = useContext(NavContext);

  const survey = sample.getSurvey();

  const { synchronising } = sample.remote;

  const href = !synchronising && `/survey/${survey.name}/${sample.cid}`;

  const deleteSurveyWrap = () => deleteSurvey(sample);
  const onUpload = e => {
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

  return (
    <IonItemSliding class="survey-list-item">
      <ErrorMessage sample={sample} />

      <IonItem routerLink={href} detail={!synchronising}>
        {getSampleInfo(sample)}
        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={uploadIsPrimary}
        />
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteSurveyWrap}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

Survey.propTypes = exact({
  sample: PropTypes.object.isRequired,
  userModel: PropTypes.object.isRequired,
  uploadIsPrimary: PropTypes.bool,
});

export default observer(Survey);
