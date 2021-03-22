import config from 'common/config';
import axios from 'axios';
import surveyConfig from 'Survey/Point/config';

export default async function fetchStats(userModel) {
  const url = `${config.backend.url}/api/v1/advanced_reports/user-stats?survey_id=${surveyConfig.id}`;
  const userAuth = btoa(`${userModel.attrs.email}:${userModel.attrs.password}`);

  const options = {
    headers: {
      'x-api-key': config.backend.apiKey,
      authorization: `Basic ${userAuth}`,
      'content-type': 'application/json',
    },
    timeout: 80000,
  };
  const res = await axios.get(url, options);

  return res.data;
}
