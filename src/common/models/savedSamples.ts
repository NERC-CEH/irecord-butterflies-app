import { initStoredSamples } from '@apps';
import { modelStore } from './store';
import Sample from './sample';
import userModel from './user';

console.log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

// eslint-disable-next-line
savedSamples.uploadAll = async () => {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: typeof Sample) =>
    !s.isUploaded() && s.upload(true, true);
  await Promise.all(savedSamples.map(getUploadPromise));

  console.log('SavedSamples: all records were uploaded!');
  userModel.refreshUploadCountStat();
};

export default savedSamples;