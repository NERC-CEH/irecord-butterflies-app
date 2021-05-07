import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonSpinner, IonLabel, IonChip, IonButton } from '@ionic/react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import './styles.scss';

const UsersSurveys = ({ onUpload, sample, uploadIsPrimary }) => {
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

  if (sample.remote.synchronising) {
    return <IonSpinner class="survey-status" />;
  }

  if (sample.isUploaded()) {
    return null;
  }

  return (
    <IonButton
      class="survey-status-upload"
      onClick={onUpload}
      fill={uploadIsPrimary ? undefined : 'outline'}
    >
      Upload
    </IonButton>
  );
};

UsersSurveys.propTypes = exact({
  sample: PropTypes.object.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploadIsPrimary: PropTypes.bool,
});

export default observer(UsersSurveys);
