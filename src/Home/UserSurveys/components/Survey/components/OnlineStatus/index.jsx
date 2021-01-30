import React from 'react';
import PropTypes from 'prop-types';
import { IonSpinner, IonLabel, IonChip } from '@ionic/react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import './styles.scss';

const UsersSurveys = props => {
  const { sample } = props;
  const { saved } = sample.metadata;

  if (!saved) {
    return (
      <IonLabel slot="end" class="survey-status">
        <IonChip color="dark" class="ion-text-wrap">
          <T>Draft</T>
        </IonChip>
      </IonLabel>
    );
  }

  if (!sample.remote.synchronising) {
    return null;
  }

  return <IonSpinner class="survey-status" />;
};

UsersSurveys.propTypes = {
  sample: PropTypes.object.isRequired,
};

export default observer(UsersSurveys);
