import mothThumbnail from 'common/images/mothThumbnailSmall.svg';
import butterflyThumbnail from 'common/images/butterflyIcon.svg';
import { Species, Photo, Resource } from 'common/types';
import species from './cache/species.json';
import * as resources from './other';
import photos from './cache/photos.json';
import './photos'; // webpack-loading only
import './photos-moth'; // webpack-loading only

const speciesResources: { [key: string]: Resource } = resources;

type ExtendedResource = Species &
  Resource & { images: Photo[] } & { country: string[] };

const extendWithResources = (sp: Species): ExtendedResource => {
  const bySpeciesID = ({ speciesID }: Photo) => speciesID === sp.id;

  const removeJpg = (photo: Photo) => ({
    ...photo,
    ...{ file: (photo.file || '').replace('.jpg', '') },
  });

  const images = (photos as Photo[]).filter(bySpeciesID).map(removeJpg);

  const hasValue = (v: any) => !!v;
  const country = [
    sp.england && 'england',
    sp.scotland && 'scotland',
    sp.wales && 'wales',
    sp['northern ireland'] && 'northern ireland',
    sp['isle of man'] && 'isle of man',
  ].filter(hasValue);

  const spExt = { ...sp, ...speciesResources[sp.id], images, country };

  let thumbnail;
  if (spExt.thumbnail) {
    thumbnail = spExt.thumbnail;
  }

  if (!spExt.thumbnail && spExt.type === 'moth') {
    thumbnail = mothThumbnail;
  }

  if (!spExt.thumbnail && spExt.type !== 'moth') {
    thumbnail = butterflyThumbnail;
  }

  return { ...spExt, thumbnail };
};

const extendedSpecies = (species as Species[]).map(extendWithResources);

/* After adding new images run this script to quick-check all are present */
// (async () => {
//   for (let spIndex = 0; extendedSpecies.length > spIndex; spIndex++) {
//     for (
//       let index = 0;
//       extendedSpecies[spIndex]?.images?.length > index;
//       index++
//     ) {
//       console.log(`/images/${extendedSpecies[spIndex].images[index].file}.jpg`);
//       await fetch(`/images/${extendedSpecies[spIndex].images[index].file}.jpg`);
//       await new Promise(resolve => setTimeout(resolve, 20));
//     }
//   }
// })();

export default extendedSpecies;
