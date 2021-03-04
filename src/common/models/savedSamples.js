import { initStoredSamples } from '@apps';
import { reaction } from 'mobx';
import { modelStore } from './store';
import Sample from './sample';
import userModel from './user';

const savedSamples = initStoredSamples(modelStore, Sample);

function uploadAllFinished() {
  console.log('SavedSamples: uploading all surveys');

  const uploadIfFinished = sample => {
    const isAlreadyUploaded = !!sample.id;
    if (isAlreadyUploaded || !sample.metadata.saved) {
      return;
    }
    const invalids = sample.validateRemote();
    if (invalids) {
      return;
    }
    sample.saveRemote();
  };
  savedSamples.forEach(uploadIfFinished);
}

const uploadFinishedSurveysAndListenForLogin = () => {
  const uploadIfLoggedIn = isLoggedIn => isLoggedIn && uploadAllFinished();
  uploadIfLoggedIn(userModel.attrs.id);

  const listenToUserLogin = () => userModel.attrs.id;
  reaction(listenToUserLogin, uploadIfLoggedIn);
};

savedSamples._init.then(uploadFinishedSurveysAndListenForLogin);

export default savedSamples;
