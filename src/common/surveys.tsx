/* eslint-disable camelcase */
import timeSurvey from 'Survey/Time/Single/config';
import AppOccurrence from 'models/occurrence';
import AppSample from 'models/sample';

export default {
  [timeSurvey.name]: timeSurvey,
};

interface Attrs {}

export interface Survey {
  id: number;
  name: string;
  label?: string;
  icon?: string;

  attrs: Attrs;

  occ?: {
    attrs: Attrs;

    create: (Occurrence: typeof AppOccurrence, taxon?: any) => AppOccurrence;

    verify?: (attrs: any) => any;
  };

  smp?: {
    attrs: Attrs;

    occ: {
      attrs: Attrs | any;

      create: (Occurrence: typeof AppOccurrence, taxon: any) => AppOccurrence;
      verify?: any;
    };

    create: (
      Sample: typeof AppSample,
      Occurrence: typeof AppOccurrence,
      taxon: any,
      zeroAbundance?: string | null,
      stage?: string
    ) => AppSample;
  };

  verify?: (attrs: any) => any;

  modifySubmission?: (submission: any) => any;

  create: (
    Sample: typeof AppSample,
    params?: any,
    surveyName?: any,
    recorder?: string
  ) => AppSample;
}
