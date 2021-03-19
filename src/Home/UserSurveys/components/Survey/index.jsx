import React from 'react';
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
} from '@ionic/react';
import clsx from 'clsx';
import species from 'common/data/species';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import butterflyListIcon from 'common/images/butterflyListIcon.svg';
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
        </IonLabel>
        <IonBadge color="medium" />
      </>
    );
  }

  return (
    <>
      <IonAvatar>
        <IonIcon icon={butterflyListIcon} color="primary" />
      </IonAvatar>

      <IonLabel position="stacked" mode="ios" color="dark">
        <IonLabel className="species-name">List</IonLabel>
        <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
      </IonLabel>
      <IonBadge color="medium" />
    </>
  );
}

const Survey = ({ sample }) => {
  const survey = sample.getSurvey();

  const { synchronising } = sample.remote;

  const href = !synchronising && `/survey/${survey.name}/${sample.cid}`;

  const deleteSurveyWrap = () => deleteSurvey(sample);
  const onUpload = e => {
    e.preventDefault();
    e.stopPropagation();

    const invalids = sample.validateRemote();
    if (sample.remote.synchronising || invalids) {
      return;
    }

    sample.saveRemote();
  };

  return (
    <IonItemSliding class="survey-list-item">
      <ErrorMessage sample={sample} />

      <IonItem routerLink={href} detail={!synchronising}>
        {getSampleInfo(sample)}
        <OnlineStatus sample={sample} onUpload={onUpload} />
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
});

export default observer(Survey);
