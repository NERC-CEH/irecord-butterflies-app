import probByTimeData from './cache/probabilityByWeek.json';
import probByLocationData from './cache/probabilityByHectad.json';
import hectadRegions from './cache/hectadRegions.json';

const cache = {};

function getAverage(probsForWeek) {
  const regions = ['E', 'W', 'S', 'N'];

  const average = {};

  const addSpeciesProbsOfRegion = region => {
    const species = Object.entries(probsForWeek[region] || {});

    const addSpeciesProbToAverage = ([speciesId, prob]) => {
      average[speciesId] = average[speciesId] || 0;
      const probability = parseFloat(prob) / regions.length;
      average[speciesId] += parseFloat(probability.toFixed(3));
    };

    species.forEach(addSpeciesProbToAverage);
  };

  regions.forEach(addSpeciesProbsOfRegion);

  return average;
}

function getHectad(probsForWeek, hectad) {
  const speciesNowAndHere = {};
  const speciesHere = {};

  const hectadProbs = probByLocationData[hectad];
  if (!hectadProbs) {
    console.warn('Hectad is missing from location data ', hectad);
    return speciesNowAndHere;
  }

  const region = hectadRegions[hectad];
  if (!region) {
    console.warn('Region is missing from hectad data ', hectad);
    return speciesNowAndHere;
  }

  const species = probsForWeek[region];
  if (!species) {
    console.warn('Region is missing from time data ', region);
    return speciesNowAndHere;
  }

  const addSpeciesProbToLocationProb = ([speciesId, prob]) => {
    const timeProb = species[speciesId];

    const speciesHasNoTimeProbs = !(timeProb >= 0);
    if (speciesHasNoTimeProbs) {
      speciesHere[speciesId] = prob;
      return;
    }

    const totalProbability = parseFloat(prob) * parseFloat(timeProb);
    speciesNowAndHere[speciesId] = parseFloat(totalProbability.toFixed(3));
  };

  Object.entries(hectadProbs).forEach(addSpeciesProbToLocationProb);

  return [speciesNowAndHere, speciesHere];
}

export default function getProbablities(weekNo, hectad = '') {
  const cacheKey = `${weekNo}${hectad}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  console.log(`Generating probabilities data for ${weekNo} - ${hectad}`);
  // We have only 52 weeks in the dataset but it can be 53 in a year
  weekNo = weekNo === 53 ? 52 : weekNo; // eslint-disable-line

  const probsForWeek = probByTimeData[weekNo];
  const probsForHectad = probByLocationData[hectad];

  let speciesNowAndHere = {};
  let speciesNow = {};
  let speciesHere = {};
  if (!probsForHectad) {
    speciesNow = getAverage(probsForWeek);
  } else {
    [speciesNowAndHere, speciesHere] = getHectad(probsForWeek, hectad);
  }

  const species = [speciesNowAndHere, speciesHere, speciesNow];

  cache[cacheKey] = species;

  return species;
}
