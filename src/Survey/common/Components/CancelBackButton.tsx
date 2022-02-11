import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import { alert } from '@apps';
import { IonButtons, IonButton, NavContext } from '@ionic/react';

function showDeleteSurveyAlertMessage() {
  const deleteSurveyPromt = (resolve: (param: boolean) => void) => {
    alert({
      header: 'Delete Survey',
      message:
        'Warning - This will discard the survey information you have entered so far.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => resolve(false),
        },
        {
          text: 'Discard',
          cssClass: 'primary',
          handler: () => resolve(true),
        },
      ],
    });
  };

  return new Promise(deleteSurveyPromt);
}

interface Props {
  sample: typeof Sample;
}

const BackCancelButton: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);

  const onDeleteSurvey = async () => {
    const change = await showDeleteSurveyAlertMessage();

    if (change) {
      await sample.destroy();
      navigate('/home/surveys', 'root');
    }
  };

  return (
    <IonButtons slot="start">
      <IonButton onClick={onDeleteSurvey}>Cancel</IonButton>
    </IonButtons>
  );
};

export default BackCancelButton;
