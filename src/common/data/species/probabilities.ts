import probByWeekData from './cache/probabilityByWeek.json';
import probByHectadData from './cache/probabilityByHectad.json';
import species from './cache/species.json';
import hectads from './cache/hectads.json';
import { Species } from './index';

type Probabilites = string[];

const cache: { [key: string]: Probabilites[] } = {};

function mapProbIdToSpeciesId(probId: number) {
  const byProbId = (sp: Species) => sp.probabilityId === probId;
  return (species as any).find(byProbId).id;
}

export default function getProbablities(
  weekNo: number,
  hectadName = '',
  probByWeek = probByWeekData,
  probByHectad = probByHectadData
) {
  const cacheKey = `${weekNo}${hectadName}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  let speciesNowAndHere: Probabilites = [];
  let speciesHere: Probabilites = [];
  let speciesNow: Probabilites = [];

  const hectad = hectads.indexOf(hectadName) + 1;

  console.log(
    `Generating probabilities data for ${weekNo} - ${hectadName}(${hectad})`
  );

  const probsForHectad = probByHectad[hectad];

  if (!probsForHectad) {
    speciesNow = probByWeek[weekNo].map(mapProbIdToSpeciesId);
  } else {
    const probsForHectadWeeks = probsForHectad.split(';');
    const getUncompressedProbs = (week: string) => {
      const speciesIds = week.match(/.{1,2}/g);
      if (!speciesIds) return [];
      const parseInt = (id: string) => Number.parseInt(id, 10);

      return speciesIds.map(parseInt).map(mapProbIdToSpeciesId);
    };
    const probsForHectadWeeksNormalized = probsForHectadWeeks.map(
      getUncompressedProbs
    );

    speciesNowAndHere = probsForHectadWeeksNormalized[weekNo] || [];
    const notInNowAndHereList = (sp: string) =>
      !speciesNowAndHere || !speciesNowAndHere.includes(sp);
    speciesHere = [...new Set(probsForHectadWeeksNormalized.flat())].filter(
      notInNowAndHereList
    );
  }

  const probs = [speciesNowAndHere, speciesHere, speciesNow];

  cache[cacheKey] = probs;

  return probs;
}
