import { useContext } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch, useLocation } from 'react-router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Page, Header, useAlert, useToast, useOnBackButton } from '@flumens';
import { NavContext, isPlatform } from '@ionic/react';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import userModel from 'models/user';
import SurveyHeaderButton from 'Survey/common/Components/SurveyHeaderButton';
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

type Props = {
  sample: Sample;
};

const HomeController = ({ sample }: Props) => {
  const { navigate, goBack } = useContext(NavContext);
  const toast = useToast();
  const showFinishConfirmationAlert = useFinishConfirmationAlert();
  const showLeaveConfirmationAlert = useShowLeaveConfirmationAlert();
  const checkSampleStatus = useValidateCheck(sample);
  const { pathname } = useLocation();
  const { url } = useRouteMatch();

  const increaseCount = async (taxon: any, is5x: boolean) => {
    if (sample.isUploaded()) return;

    if (sample.hasZeroAbundance(taxon.id)) {
      const byTaxonId = (smp: Sample) =>
        smp.occurrences[0].attrs.taxon.id === taxon.id;
      const smp = sample.samples.find(byTaxonId)!;
      // eslint-disable-next-line no-param-reassign
      smp.occurrences[0].attrs.zeroAbundance = undefined;
      // eslint-disable-next-line no-param-reassign
      smp.occurrences[0].attrs.stage = sample.attrs.stage;
      smp.startGPS();

      sample.save();
      return;
    }

    const survey = sample.getSurvey();
    const { stage } = sample.attrs;
    const zeroAbundance = null;

    const addOneCount = async () => {
      const newSubSample = await survey.smp!.create!({
        Sample,
        Occurrence,
        taxon,
        zeroAbundance,
        stage,
      });
      newSubSample.startGPS();

      sample.samples.push(newSubSample);
    };

    if (is5x) {
      await Promise.all([...Array(5)].map(addOneCount));
    } else {
      await addOneCount();
    }
    sample.save();

    isPlatform('hybrid') && hapticsImpact();
  };

  const _processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    const finishSurvey = await showFinishConfirmationAlert();
    if (!finishSurvey) return;

    appModel.attrs['draftId:single-species-count'] = null; // eslint-disable-line
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
    <Page id="single-species-count-home">
      <Header
        title="Survey"
        onLeave={onLeave}
        rightSlot={<SurveyHeaderButton onClick={onFinish} sample={sample} />}
      />
      <Main sample={sample} increaseCount={increaseCount} />
    </Page>
  );
};

export default observer(HomeController);
