/* eslint-disable camelcase */
import timeSurvey from 'Survey/Time/config';
import AppOccurrence from 'models/occurrence';
import AppSample from 'models/sample';

export default {
  [timeSurvey.name]: timeSurvey,
};

interface Attrs {}

export interface Survey {
  id: number;
  name: string;

  attrs: Attrs;

  smp?: {
    attrs: Attrs;

    occ: {
      attrs: Attrs | any;

      create: (
        Occurrence: typeof AppOccurrence,
        taxon: any,
        zeroAbundance?: string | null
      ) => typeof AppOccurrence;
      verify?: any;
    };

    create: (
      SAmple: typeof AppSample,
      Occurrence: typeof AppOccurrence,
      taxon: any,
      zeroAbundance?: string | null
    ) => typeof AppSample;
  };

  verify?: (attrs: any) => any;

  create: (
    sample: any,
    params?: any,
    surveyName?: any,
    recorder?: string
  ) => any;
}
