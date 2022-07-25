import merge from 'lodash/merge';

import survey from '../Single/config';

const speciesSurvey = merge({}, survey, {
  id: -1,
  name: 'multi-species-count',

  smp: {
    create(AppSample: any, AppOccurrence: any, taxon: any, _: any, stage: any) {
      const sample = new AppSample({
        metadata: {
          survey_id: speciesSurvey.id,
          survey: speciesSurvey.name,
        },
        attrs: {
          location: {},
        },
      });

      const occurrence = survey?.smp?.occ.create(AppOccurrence, taxon);

      sample.occurrences.push(occurrence);

      sample.occurrences[0].attrs.stage = stage;

      return sample;
    },
  },

  create(AppSample: any) {
    const sample = new AppSample({
      metadata: {
        survey: speciesSurvey.name,
        survey_id: speciesSurvey.id,
        pausedTime: 0,
        timerPausedTime: null,
        startStopwatchTime: null,
      },
      attrs: {
        location: {},
        duration: 0,
        cloud: null,
        sun: null,
        recorders: 1,
        stage: 'Adult',
      },
    });

    sample.toggleBackgroundGPS();
    sample.startMetOfficePull();

    return sample;
  },
});

export default speciesSurvey;
