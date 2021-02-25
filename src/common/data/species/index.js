import species from './cache/species.json';
import * as speciesResources from './other';
import photos from './cache/photos.json';
import './photos'; // webpack-loading only

const extendWithResources = sp => {
  const bySpeciesID = ({ speciesID }) => speciesID === sp.id;

  const removeJpg = photo => ({
    ...photo,
    ...{ file: photo.file.replace('.jpg', '') },
  });

  const images = photos.filter(bySpeciesID).map(removeJpg);

  Object.assign(sp, speciesResources[sp.id], {
    images,
  });
};

species.forEach(extendWithResources);

/* After adding new images run this script to quick-check all are present */
// (async () => {
//   for (let spIndex = 0; species.length > spIndex; spIndex++) {
//     for (let index = 0; species[spIndex].images.length > index; index++) {
//       console.log(`/images/${species[spIndex].images[index].file}.jpg`);
//       await fetch(`/images/${species[spIndex].images[index].file}.jpg`);
//       await new Promise(resolve => setTimeout(resolve, 20));
//     }
//   }
// })();

export default species;
