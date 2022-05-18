import { initStoredSamples } from '@apps';
import { modelStore } from './store';
import Sample from './sample';
import userModel from './user';
import appModel from './app';
import remotePullExtInit from './savedSamplesRemotePullExt';

console.log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

// eslint-disable-next-line
savedSamples.uploadAll = async () => {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: Sample) => !s.isUploaded() && s.upload(true);
  await Promise.all(savedSamples.map(getUploadPromise));

  console.log('SavedSamples: all records were uploaded!');
  userModel.refreshUploadCountStat();
};

remotePullExtInit(savedSamples, userModel, appModel);

export default savedSamples;
