import listSurvey from 'Survey/List/config';
import defaultSurvey from 'Survey/Point/config';
import timeMultiSurvey from 'Survey/Time/Multi/config';
import timeSingleSurvey from 'Survey/Time/Single/config';
import { Survey } from 'Survey/common/config';

// eslint-disable-next-line import/prefer-default-export
export const getSurveyQuery = ({ id }: Survey) => ({
  match: {
    'metadata.survey.id': id,
  },
});

export const matchAppSurveys = {
  bool: {
    should: [defaultSurvey, listSurvey, timeSingleSurvey, timeMultiSurvey].map(
      getSurveyQuery
    ),
  },
};
