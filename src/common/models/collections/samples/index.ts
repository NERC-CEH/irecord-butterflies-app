import { SampleCollection as SampleCollectionBase } from '@flumens';
import config from 'common/config';
import Occurrence from 'common/models/occurrence';
import listSurveyConf from 'Survey/List/config';
import pointSurveyConf from 'Survey/Point/config';
import appModel from '../../app';
import Sample from '../../sample';
import { samplesStore } from '../../store';
import userModel from '../../user';
import remotePullExtInit, { Verification } from './savedSamplesRemotePullExt';

console.log('SavedSamples: initializing');

class SampleCollection extends SampleCollectionBase<Sample> {
  async fetchRemote(from: number, surveyIDs: any[]): Promise<Sample[]> {
    const samples = await super.fetchRemote(from, surveyIDs);
    const fixListSurveyId = (smp: Sample) => {
      if (
        !smp.isStored &&
        smp.occurrences.length > 1 &&
        smp.data.surveyId == pointSurveyConf.id // eslint-disable-line eqeqeq
      ) {
        // eslint-disable-next-line no-param-reassign
        smp.data.surveyId = listSurveyConf.id;
      }
    };
    samples.forEach(fixListSurveyId);
    return samples;
  }
}

const samples: SampleCollection & { verified: Verification } =
  new SampleCollection({
    store: samplesStore,
    Model: Sample,
    Occurrence,
    url: config.backend.indicia.url,
    getAccessToken: () => userModel.getAccessToken(),
  }) as any;

// eslint-disable-next-line
export async function uploadAllSamples(toast: any) {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: Sample) =>
    !s.isUploaded && s.metadata.saved && s.upload();

  const processError = (err: any) => {
    if (err.isHandled) return;
    toast.error(err);
  };
  await Promise.all(samples.map(getUploadPromise)).catch(processError);

  console.log('SavedSamples: all records were uploaded!');
}

export function removeAllSynced() {
  console.log('SavedSamples: removing all synced samples.');

  const safeDestroy = (smp: Sample) => {
    if (!smp.isStored) return null;
    if (!smp.isDisabled) return null;

    return smp.destroy();
  };

  const toWait = samples.map(safeDestroy);

  return Promise.all(toWait);
}

remotePullExtInit(samples, userModel, appModel);

export function getPending() {
  const byUploadStatus = (sample: Sample) => !sample.syncedAt;

  return samples.filter(byUploadStatus);
}

export function bySurveyDate(sample1: Sample, sample2: Sample) {
  const date1 = new Date(sample1.data.date);
  const moveToTop = !date1 || date1.toString() === 'Invalid Date';
  if (moveToTop) return -1;

  const date2 = new Date(sample2.data.date);
  return date2.getTime() - date1.getTime();
}

export default samples;
