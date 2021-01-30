import { initStoredSamples } from '@apps';
import { modelStore } from './store';
import Sample from './sample';

const savedSamples = initStoredSamples(modelStore, Sample);

export default savedSamples;
