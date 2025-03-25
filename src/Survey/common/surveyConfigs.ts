/* eslint-disable import/prefer-default-export */
import listSurvey from 'Survey/List/config';
import defaultSurvey from 'Survey/Point/config';
import timeMultiSurvey from 'Survey/Time/Multi/config';
import timeSingleSurvey from 'Survey/Time/Single/config';

export const getSurveyConfigs = () => ({
  [defaultSurvey.id]: defaultSurvey,
  [listSurvey.id]: listSurvey,
  [timeSingleSurvey.id]: timeSingleSurvey,
  [timeMultiSurvey.id]: timeMultiSurvey,
});
