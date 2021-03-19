// import config from 'common/config';
// import axios from 'axios';
// import surveyConfig from 'Survey/Point/config';

export default async function fetchStats() {
  return {
    myTotalRecords: 773,
    projectRecordsCount: 510653,
    projectSpeciesCount: 114,
    myProjectRecords: 0,
    myProjectSpecies: 0,
    myProjectRecordsThisYear: 0,
    myProjectSpeciesThisYear: 0,
    myProjectSpeciesRatio: 0,
    myProjectActivityRatio: 0,
    myProjectRarityMetric: -7.1,
  };

  // const url = `${config.backend.url}/api/v1/advanced_reports/user-stats?survey_id=${surveyConfig.id}`;
  // const userAuth = btoa(`${userModel.attrs.email}:${userModel.attrs.password}`);

  // const options = {
  //   // authorization: `Basic ${userAuth}`,
  //   // 'x-api-key': config.backend.apiKey,
  //   headers: {
  //     'x-api-key': 'E97DMRqIsbd5TBhVUXgJlaLoKfFtp3HijvCZ6A0r',
  //     Authorization: 'Basic dGVzdEBmbHVtZW5zLmlvOnRlc3Q=',
  //     'content-type': 'application/json',
  //   },
  //   // timeout: 80000,
  // };
  // const res = await axios.get(
  //   'https://www.brc.ac.uk/irecord/api/v1/advanced_reports/user-stats?survey_id=101',
  //   options
  // );

  // return res.data;
}
