import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import appModel from 'models/app';
import userModel from 'models/user';
import { observer } from 'mobx-react';
import { Page, Header, showInvalidsMessage } from '@apps';
import { IonButton, NavContext, isPlatform } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Main from './Main';

const hapticsImpact = async () => {
  await Haptics.impact({ style: ImpactStyle.Heavy });
};

type Props = {
  sample: typeof Sample;
};

const HomeController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const isDisabled = sample.isUploaded();
  const isEditing = sample.metadata.saved;

  const increaseCount = (taxon: any) => {
    if (sample.isUploaded()) return;

    if (sample.hasZeroAbundance()) {
      // eslint-disable-next-line no-param-reassign
      sample.samples[0].occurrences[0].attrs.zero_abundance = null;
      // eslint-disable-next-line no-param-reassign
      sample.samples[0].occurrences[0].attrs.stage = sample.attrs.stage;
      sample.samples[0].startGPS();

      sample.save();
      return;
    }

    const survey = sample.getSurvey();
    const { stage } = sample.attrs;
    const zeroAbundance = null;

    const newSubSample = survey.smp.create(
      Sample,
      Occurrence,
      taxon,
      zeroAbundance,
      stage
    );

    sample.samples.push(newSubSample);
    newSubSample.startGPS();
    sample.save();

    isPlatform('hybrid') && hapticsImpact();
  };

  const _processDraft = async () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

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
    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      navigate(`/user/login`);
      return;
    }

    sample.upload();
    navigate(`/home/surveys`, 'root');
  };

  const onFinish = async () => {
    if (!sample.metadata.saved) {
      await _processDraft();
      return;
    }

    await _processSubmission();
  };

  const finishButton = isDisabled ? null : (
    <IonButton onClick={onFinish} color="primary" fill="solid" shape="round">
      {isEditing ? 'Upload' : 'Finish'}
    </IonButton>
  );

  return (
    <Page id="single-species-count-home">
      <Header title="Survey" rightSlot={finishButton} />
      <Main sample={sample} increaseCount={increaseCount} />
    </Page>
  );
};

export default observer(HomeController);
