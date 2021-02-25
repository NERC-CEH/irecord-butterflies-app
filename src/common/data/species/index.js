import species from './cache/species.json';
import * as speciesResources from './other';
import photos from './cache/photos.json';
import './photos'; // webpack-loading only

const extendWithResources = sp => {
  const bySpeciesID = ({ speciesID }) => speciesID === sp.id;

  Object.assign(sp, speciesResources[sp.id], {
    images: photos.filter(bySpeciesID),
  });
};

species.forEach(extendWithResources);

export default species;
