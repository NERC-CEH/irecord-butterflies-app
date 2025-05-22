import axios from 'axios';
import config from 'common/config';
import { UserModel } from 'common/models/user';

interface Species {
  taxon_rank: 'Subspecies' | 'Species';
  accepted_name: string;
  vernacular_name?: string;
  group: string;
  taxon_meaning_id: string;
  record_count: number;
  total_individual_count: number;

  // accepted_taxon_id
  // family
  // first_date
  // kingdom
  // last_date
  // order
  // taxon_rank
}

export interface SpeciesStats extends Species {
  name: string;
}

// fetchStats fetches and processes statistics for a user and year
const fetchStats = async (
  userModel: UserModel,
  surveyId: number,
  year: string
): Promise<SpeciesStats[]> => {
  // log fetching action
  console.debug(`🔵 Statistics: fetching recorded-taxa-list for ${year} year`);

  // normalize year for API
  const normalizedYear = year === 'all' ? '' : year;

  // build API url
  const url = `${config.backend.url}/api/v2/advanced_reports/recorded-taxa-list?survey_id=${surveyId}&year=${normalizedYear}&user_id=${userModel.data.indiciaUserId}`;

  // set request options
  const options = {
    headers: {
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
      'content-type': 'application/json',
    },
    timeout: 80000,
  };

  // fetch data from API
  const res = await axios.get(url, options);

  // normalize species name
  const normalizeName = (sp: Species): SpeciesStats => ({
    ...sp,
    name:
      sp?.taxon_rank === 'Subspecies'
        ? sp.accepted_name
        : sp.vernacular_name || sp.accepted_name,
  });

  // sort species alphabetically
  const alphabetically = (sp1: SpeciesStats, sp2: SpeciesStats) =>
    sp1.name!.localeCompare(sp2.name!);

  // filter only butterfly insects
  const onlyButterflyInsects = (sp: Species) =>
    sp.group === 'insect - butterfly';

  // process and return data
  return res.data
    .filter(onlyButterflyInsects)
    .map(normalizeName)
    .sort(alphabetically);
};

export default fetchStats;
