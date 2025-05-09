import merge from 'lodash/merge';
import { Survey } from 'Survey/common/config';
import survey from '../Single/config';

const speciesSurvey: any = merge({}, survey, {
  id: 702,
  name: 'multi-species-count',

  smp: {
    async create({ Sample, Occurrence, taxon, stage }) {
      const sample = new Sample({
        data: {
          surveyId: speciesSurvey.id,
          enteredSrefSystem: 4326,
          location: {},
        },
      });

      const occurrence = await survey.smp!.occ!.create!({
        Occurrence: Occurrence!,
        taxon,
      })!;

      sample.occurrences.push(occurrence);

      sample.occurrences[0].data.stage = stage;
      sample.startGPS();

      return sample;
    },
  },

  async create({ Sample }) {
    const sample = new Sample({
      metadata: {
        pausedTime: 0,
        startStopwatchTime: null,
      },
      data: {
        surveyId: speciesSurvey.id,
        date: new Date().toISOString(),
        enteredSrefSystem: 4326,
        location: {},
        duration: 0,
        cloud: null,
        sun: null,
        recorders: 1,
        stage: 'Adult',
      },
    });

    sample.data.startTime = new Date(sample.createdAt).toISOString();
    sample.startVibrateCounter();

    sample.toggleBackgroundGPS();
    sample.startMetOfficePull();

    return sample;
  },
} as Partial<Survey>);

export default speciesSurvey;
