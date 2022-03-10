import probByWeek from './cache/probabilityByWeek.json';
import probByHectad from './cache/probabilityByHectad.json';
import species from './cache/species.json';
import hectads from './cache/hectads.json';

const cache = {};

function mapProbIdToSpeciesId(probId) {
  const byProbId = sp => sp.probabilityId === probId;
  return species.find(byProbId).id;
}

export default function getProbablities(weekNo, hectadName = '') {
  const cacheKey = `${weekNo}${hectadName}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  let speciesNowAndHere = [];
  let speciesHere = [];
  let speciesNow = [];

  const hectad = hectads.indexOf(hectadName) + 1;

  console.log(
    `Generating probabilities data for ${weekNo} - ${hectadName}(${hectad})`
  );

  const probsForHectad = probByHectad[hectad];

  if (!probsForHectad) {
    speciesNow = probByWeek[weekNo].map(mapProbIdToSpeciesId);
  } else {
    const probsForHectadWeeks = probsForHectad.split(';');
    const getUncompressedProbs = week => {
      const speciesIds = week.match(/.{1,2}/g);
      if (!speciesIds) return [];
      const parseInt = id => Number.parseInt(id, 10);

      // if (index == weekNo) {
      //   console.log(speciesIds.map(parseInt));
      // }
      return speciesIds.map(parseInt).map(mapProbIdToSpeciesId);
    };
    const probsForHectadWeeksNormalized = probsForHectadWeeks.map(
      getUncompressedProbs
    );

    speciesNowAndHere = probsForHectadWeeksNormalized[weekNo] || [];
    const notInNowAndHereList = sp =>
      !speciesNowAndHere || !speciesNowAndHere.includes(sp);
    speciesHere = [...new Set(probsForHectadWeeksNormalized.flat())].filter(
      notInNowAndHereList
    );
  }

  const probs = [speciesNowAndHere, speciesHere, speciesNow];
  // console.log(probs);

  cache[cacheKey] = probs;

  return probs;
}
