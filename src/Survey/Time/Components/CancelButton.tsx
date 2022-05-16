import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import { useAlert } from '@apps';
import { IonButtons, IonButton, NavContext } from '@ionic/react';

function useDeleteSurveyPrompt() {
  const alert = useAlert();

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

  const deleteSurveyPromtWrap = () => new Promise(deleteSurveyPromt);

  return deleteSurveyPromtWrap;
}

interface Props {
  sample: typeof Sample;
}

const CancelButton: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const shouldDeleteSurvey = useDeleteSurveyPrompt();

  const onDeleteSurvey = async () => {
    const change = await shouldDeleteSurvey();

    if (change) {
      await sample.destroy();
      navigate('/home/surveys', 'root');
    }
  };

  return (
    <IonButtons slot="start">
      <IonButton color="dark" onClick={onDeleteSurvey}>
        Cancel
      </IonButton>
    </IonButtons>
  );
};

export default CancelButton;
