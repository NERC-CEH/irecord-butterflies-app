import { SampleCollection } from '@flumens';
import appModel from '../../app';
import Sample from '../../sample';
import { samplesStore } from '../../store';
import userModel from '../../user';
import remotePullExtInit, { Verification } from './savedSamplesRemotePullExt';

// import remotePullExtInit, { Verification } from './savedSamplesRemotePullExt';

console.log('SavedSamples: initializing');
const samples: SampleCollection<Sample> & {
  verified: Verification;
  uploadAll: any;
} = new SampleCollection({
  store: samplesStore,
  Model: Sample,
}) as any;

// eslint-disable-next-line
samples.uploadAll = async () => {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: Sample) => !s.isUploaded() && s.upload(true);
  await Promise.all(samples.map(getUploadPromise));

  console.log('SavedSamples: all records were uploaded!');
  userModel.refreshUploadCountStat();
};

remotePullExtInit(samples, userModel, appModel);

export function getPending() {
  const byUploadStatus = (sample: Sample) => !sample.syncedAt;

  return samples.filter(byUploadStatus);
}

export default samples;
