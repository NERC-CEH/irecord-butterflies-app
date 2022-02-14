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
        taxon: any
      ) => typeof AppOccurrence;
      verify?: any;
    };

    create: (
      Sample: typeof AppSample,
      Occurrence: typeof AppOccurrence,
      taxon: any,
      zeroAbundance?: string | null,
      stage?: string
    ) => typeof AppSample;
  };

  verify?: (attrs: any) => any;

  modifySubmission?: (submission: any) => any;

  create: (
    sample: any,
    params?: any,
    surveyName?: any,
    recorder?: string
  ) => any;
}
