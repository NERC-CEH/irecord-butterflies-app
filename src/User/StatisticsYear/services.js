import config from 'common/config';
import axios from 'axios';
import surveyConfig from 'Survey/Point/config';

export default async function fetchStats(userModel, year) {
  console.log(`Statistics: fetching recorded-taxa-list for ${year} year`);

  const normalizedYear = year === 'all' ? '' : year;
  const url = `${config.backend.url}/api/v2/advanced_reports/recorded-taxa-list?survey_id=${surveyConfig.id}&year=${normalizedYear}&user_id=${userModel.attrs.indiciaUserId}`;

  const options = {
    headers: {
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
      'content-type': 'application/json',
    },
    timeout: 80000,
  };
  const res = await axios.get(url, options);

  const normalizeName = sp => ({
    ...sp,
    name:
      sp?.taxon_rank === 'Subspecies'
        ? sp.accepted_name
        : sp.vernacular_name || sp.accepted_name,
  });

  const alphabetically = (sp1, sp2) => sp1.name.localeCompare(sp2.name);

  const onlyButterflyInsects = sp => sp.group === 'insect - butterfly';

  return res.data
    .filter(onlyButterflyInsects)
    .map(normalizeName)
    .sort(alphabetically);
}
