import { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch, useLocation } from 'react-router';
import { Page, Header, useAlert, useOnBackButton, useSample } from '@flumens';
import { NavContext, IonButton, IonButtons } from '@ionic/react';
import Sample, { useValidateCheck } from 'models/sample';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Main from './Main';

function useDeleteSurveyPrompt(alert: any) {
  const deleteSurveyPromt = (resolve: (param: boolean) => void) => {
    alert({
      header: 'Delete Survey',
      message:
        'Warning - This will discard the survey information you have entered so far.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => resolve(false),
        },
        {
          text: 'Discard',
          role: 'destructive',
          handler: () => resolve(true),
        },
      ],
    });
  };

  const deleteSurveyPromtWrap = () => new Promise(deleteSurveyPromt);

  return deleteSurveyPromtWrap;
}

const DetailsController = () => {
  const alert = useAlert();
  const { navigate, goBack } = useContext(NavContext);
  const { url } = useRouteMatch();
  const location = useLocation();

  const { sample } = useSample<Sample>();

  const checkSampleStatus = useValidateCheck(sample);
  const [isAlertPresent, setIsAlertPresent] = useState(false);
  const shouldDeleteSurvey = useDeleteSurveyPrompt(alert);

  const hasTimerStarted = sample!.data.startTime;

  const onStartTimer = () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    // eslint-disable-next-line no-param-reassign
    sample!.data.startTime = new Date();
    sample!.save();

    const path = url.replace('/details', '');
    navigate(path, 'forward', 'replace');
  };

  const isValid = !sample!.validateRemote();

  const startTimerButton = !hasTimerStarted && (
    <HeaderButton
      onClick={onStartTimer}
      color={isValid ? 'primary' : 'medium'}
      className="px-2"
    >
      Start Count
    </HeaderButton>
  );

  // Entering details/:attr page, but match still showing details page match.url.
  const isDetailsPage = url !== location.pathname;

  const onDeleteSurvey = async () => {
    if (isAlertPresent || isDetailsPage || hasTimerStarted) {
      goBack();
      return;
    }

    setIsAlertPresent(true);

    const change = await shouldDeleteSurvey();
    if (change) {
      await sample!.destroy();

      setIsAlertPresent(false);
      navigate('/home/surveys', 'root', 'push', undefined, {
        unmount: true,
      });
      return;
    }

    setIsAlertPresent(false);
  };

  useOnBackButton(onDeleteSurvey);

  if (!sample) return null;

  // eslint-disable-next-line react/no-unstable-nested-components
  const cancelButtonWrap = () => (
    <IonButtons slot="start">
      <IonButton color="dark" onClick={onDeleteSurvey}>
        Cancel
      </IonButton>
    </IonButtons>
  );

  const onChangeCounter = (value: number | null) => {
    if (!Number.isFinite(value)) return;
    // eslint-disable-next-line no-param-reassign
    sample!.data.recorders = value!;
    sample!.save();
  };

  return (
    <Page id="species-count-detail">
      <Header
        BackButton={!hasTimerStarted ? cancelButtonWrap : undefined}
        title="Survey Details"
        rightSlot={startTimerButton}
      />

      <Main sample={sample} onChangeCounter={onChangeCounter} />
    </Page>
  );
};

export default observer(DetailsController);
