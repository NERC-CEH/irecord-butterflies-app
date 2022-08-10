import mothThumbnail from 'common/images/mothThumbnailSmall.svg';
import butterflyThumbnail from 'common/images/butterflyIcon.svg';
import species from './cache/species.json';
import * as resources from './other';
import photos from './cache/photos.json';
import './photos'; // webpack-loading only
import './photos-moth'; // webpack-loading only

export interface SpeciesInfo {
  probabilityId: number;
  id: string;
  type: string;
  warehouseId: number;
  commonName: string;
  scientificName: string;
  inGuide?: boolean;
  group?: string;
  family?: string;
  colour?: string[];
  markings?: string[];
  england?: string;
  scotland?: string;
  wales?: string;
  'northern ireland'?: string;
  'isle of man'?: string;
  size?: string[];
  idTips?: string;
  habitats?: string;
  ukStatus?: string;
  webLink?: string;
  survey?: string;
  confusionSpecies?: string[];
  taxonMeaningId: number;
}

interface Photo {
  speciesID: string;
  file: string;
  author: string;
  title: string;
}

interface Resource {
  thumbnail: string;
  thumbnailBackground?: string;
  map?: string;
  lifechart?: string;
}

const speciesResources: { [key: string]: Resource } = resources;

export type Species = SpeciesInfo &
  Resource & { images: Photo[]; country: string[] };

const extendWithResources = (sp: SpeciesInfo): Species => {
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
  ].filter(hasValue) as string[];

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

const extendedSpecies: Species[] = species.map(extendWithResources);

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
