import { FC, useContext } from 'react';
import Sample, { useValidateCheck } from 'models/sample';
import Occurrence from 'models/occurrence';
import appModel from 'models/app';
import userModel from 'models/user';
import { observer } from 'mobx-react';
import { Page, Header, useAlert, useToast, useOnBackButton } from '@flumens';
import { IonButton, NavContext, isPlatform } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useRouteMatch, useLocation } from 'react-router';
import Main from './Main';

function useFinishConfirmationAlert() {
  const alert = useAlert();

  const confirmationPrompt = (resolve: (param: boolean) => void) => {
    alert({
      header: 'Finish survey',
      message: 'Are you sure you want to finish this timed count?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No, continue count',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => resolve(false),
        },
        {
          text: 'Yes, finish count',
          cssClass: 'primary',
          handler: () => resolve(true),
        },
      ],
    });
  };

  const confirmationPromptWrap = () => new Promise(confirmationPrompt);

  return confirmationPromptWrap;
}

function useShowLeaveConfirmationAlert() {
  const alert = useAlert();

  const confirmationPrompt = (resolve: (param: boolean) => void) => {
    alert({
      header: 'Leaving survey',
      message:
        'To resume your timed count, select My Records at the bottom of the screen and then tap on the relevant count.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
          handler: () => resolve(true),
        },
      ],
    });
  };

  const confirmationPromptWrap = () => new Promise(confirmationPrompt);

  return confirmationPromptWrap;
}

const hapticsImpact = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const useDeleteSpeciesPrompt = () => {
  const alert = useAlert();

  function showDeleteSpeciesPrompt({ commonName }: any) {
    const prompt = (resolve: any) => {
      alert({
        header: 'Delete',
        message: (
          <>
            Are you sure you want to delete <b>{commonName}</b>?
          </>
        ),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: resolve,
          },
        ],
      });
    };

    return new Promise(prompt);
  }

  return showDeleteSpeciesPrompt;
};

type Props = {
  sample: Sample;
};

const HomeController: FC<Props> = ({ sample }) => {
  const showDeleteSpeciesPrompt = useDeleteSpeciesPrompt();
  const { navigate, goBack } = useContext(NavContext);
  const toast = useToast();
  const showFinishConfirmationAlert = useFinishConfirmationAlert();
  const showLeaveConfirmationAlert = useShowLeaveConfirmationAlert();
  const checkSampleStatus = useValidateCheck(sample);
  const { pathname } = useLocation();
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded();
  const isEditing = sample.metadata.saved;

  const deleteSpecies = (taxon: any) => {
    const destroyWrap = () => {
      const matchingTaxon = (smp: Sample) =>
        smp.occurrences[0].attrs.taxon.warehouseId === taxon.warehouseId;
      const subSamplesMatchingTaxon = sample.samples.filter(matchingTaxon);

      const destroy = (s: Sample) => s.destroy();
      subSamplesMatchingTaxon.forEach(destroy);
    };

    showDeleteSpeciesPrompt(taxon).then(destroyWrap);
  };

  const increaseCount = (taxon: any, is5x: boolean) => {
    if (sample.isUploaded()) return;

    const survey = sample.getSurvey();
    const { stage } = sample.attrs;
    const zeroAbundance = null;

    const addOneCount = () => {
      const newSubSample = survey.smp.create(
        Sample,
        Occurrence,
        taxon,
        zeroAbundance,
        stage
      );
      newSubSample.startGPS();

      sample.samples.push(newSubSample);
    };

    if (is5x) {
      [...Array(5)].forEach(addOneCount);
    } else {
      addOneCount();
    }
    sample.save();

    isPlatform('hybrid') && hapticsImpact();
  };

  const _processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    const finishSurvey = await showFinishConfirmationAlert();
    if (!finishSurvey) return;

    appModel.attrs['draftId:multi-species-count'] = null; // eslint-disable-line
    await appModel.save();

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = Date.now();

    // eslint-disable-next-line no-param-reassign
    sample.attrs.duration =
      sample.metadata.saved -
      new Date(sample.attrs.startTime).getTime() -
      new Date(sample.metadata.pausedTime).getTime();

    sample.cleanUp();
    sample.save();

    navigate(`/home/surveys`, 'root');
  };

  const _processSubmission = () => {
    const isLoggedIn = userModel.isLoggedIn();
    if (!isLoggedIn) {
      navigate(`/user/login`);
      return;
    }

    sample.upload().catch(toast.error);
    navigate(`/home/surveys`, 'root');
  };

  const onFinish = async () => {
    if (!sample.metadata.saved) {
      await _processDraft();
      return;
    }

    await _processSubmission();
  };

  const isValid = !sample.validateRemote();

  const finishButton = isDisabled ? null : (
    <IonButton
      onClick={onFinish}
      color={isValid ? 'primary' : 'medium'}
      fill="solid"
      shape="round"
    >
      {isEditing ? 'Upload' : 'Finish'}
    </IonButton>
  );

  const isDetailsPage = url !== pathname;

  const onLeave = async () => {
    if (isDetailsPage) {
      goBack();
      return;
    }

    const canPauseTimer =
      !sample.metadata.saved && !sample.metadata.timerPausedTime;

    if (canPauseTimer) {
      await showLeaveConfirmationAlert();
    }

    if (canPauseTimer) {
      // eslint-disable-next-line no-param-reassign
      sample.metadata.timerPausedTime = new Date();
      sample.save();
    }

    navigate(`/home/surveys`, 'root', 'pop'); // root instead of back because of some url mess up
  };
  useOnBackButton(onLeave);

  return (
    <Page id="multi-species-count-home">
      <Header title="Survey" onLeave={onLeave} rightSlot={finishButton} />
      <Main
        sample={sample}
        increaseCount={increaseCount}
        deleteSpecies={deleteSpecies}
      />
    </Page>
  );
};

export default observer(HomeController);
