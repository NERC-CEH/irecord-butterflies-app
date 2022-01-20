/* eslint-disable camelcase */
import timeSurvey from 'Survey/Time/config';

export default {
  [timeSurvey.name]: timeSurvey,
};

interface Attrs {}

export interface Survey {
  id: number;
  name: string;

  attrs: Attrs;

  smp?: {
    occ?: {};
  };

  verify?: (attrs: any) => any;

  create: (
    sample: any,
    params?: any,
    surveyName?: any,
    recorder?: string
  ) => any;
}
