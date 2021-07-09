import config from 'common/config';
import axios from 'axios';
import surveyConfig from 'Survey/Point/config';

export default async function fetchStats(userModel, year) {
  console.log(`Statistics: fetching recorded-taxa-list for ${year} year`);

  const normalizedYear = year === 'all' ? '' : year;
  const url = `${config.backend.url}/api/v1/advanced_reports/recorded-taxa-list?survey_id=${surveyConfig.id}&year=${normalizedYear}&user_id=${userModel.attrs.indiciaUserId}`;
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

  const normalizeName = sp => ({
    ...sp,
    name: sp.vernacular_name || sp.accepted_name,
  });
  const alphabetically = (sp1, sp2) => sp1.name.localeCompare(sp2.name);
  return res.data.map(normalizeName).sort(alphabetically);
}
