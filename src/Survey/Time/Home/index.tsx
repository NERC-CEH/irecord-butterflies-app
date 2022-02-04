import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import appModel from 'models/app';
import userModel from 'models/user';
import { observer } from 'mobx-react';
import { Page, Header, alert, showInvalidsMessage } from '@apps';
import { IonButton, NavContext, isPlatform } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Main from './Main';

const hapticsImpact = async () => {
  await Haptics.impact({ style: ImpactStyle.Heavy });
};

type Props = {
  sample: typeof Sample;
};

function showDeleteSpeciesPrompt(taxon: any) {
  const prompt = (resolve: any) => {
    const name = taxon.commonName;
    alert({
      header: 'Delete',
      message: (
        <>
          Are you sure you want to delete <b>{name}</b> species ?
        </>
      ),

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
        },
        {
          text: 'Delete',
          cssClass: 'secondary',
          handler: resolve,
        },
      ],
    });
  };

  return new Promise(prompt);
}

const HomeController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const isDisabled = sample.isUploaded();
  const isEditing = sample.metadata.saved;

  const deleteSpecies = (taxon: any) => {
    const deleteSp = () => {
      const matchingTaxon = (smp: typeof Sample) =>
        smp.occurrences[0].attrs.taxon.warehouse_id === taxon.warehouse_id;
      const subSamplesMatchingTaxon = sample.samples.filter(matchingTaxon);

      const destroy = (s: typeof Sample) => s.destroy();
      subSamplesMatchingTaxon.forEach(destroy);
    };

    showDeleteSpeciesPrompt(taxon).then(deleteSp);
  };

  const increaseCount = (taxon: any) => {
    if (sample.hasZeroAbundance()) {
      // eslint-disable-next-line no-param-reassign
      sample.samples[0].occurrences[0].attrs.zero_abundance = null;
      sample.samples[0].startBackgroundGPS();
      sample.save();
      return;
    }

    if (sample.isUploaded()) {
      return;
    }

    const survey = sample.getSurvey();

    const newSubSample = survey.smp.create(Sample, Occurrence, taxon);

    sample.samples.push(newSubSample);
    newSubSample.startBackgroundGPS();
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
      new Date(sample.attrs.surveyStartTime).getTime() -
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
      <Header title="Single species count" rightSlot={finishButton} />
      <Main
        sample={sample}
        increaseCount={increaseCount}
        deleteSpecies={deleteSpecies}
      />
    </Page>
  );
};

export default observer(HomeController);
