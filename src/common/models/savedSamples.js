import { initStoredSamples } from '@apps';
import { modelStore } from './store';
import Sample from './sample';

const savedSamples = initStoredSamples(modelStore, Sample);

// eslint-disable-next-line
savedSamples.uploadAll = () => {
  console.log('SavedSamples: uploading all.');
  const upload = s => !s.isUploaded() && s.upload(true);
  savedSamples.forEach(upload);
};

export default savedSamples;
