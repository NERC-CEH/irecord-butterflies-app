import species from './cache/species.json';
import * as resources from './other';
import photos from './cache/photos.json';
import './photos'; // webpack-loading only

interface Species {
  id: string;
  type?: string;
  warehouseId: number;
  commonName: string;
  scientificName: string;
  status: string;
  group: string;
  family: string;
  colour: string[];
  markings: string[];
  england: string;
  scotland: string;
  wales: string;
  'northern ireland': string;
  'isle of man': string;
  size: string[];
  idTips: string;
  habitats: string;
  ukStatus: string;
  whenToSee?: string;
  webLink: string;
}

interface Photo {
  speciesID: string;
  file: string;
  author: string;
  title: string;
}

interface Resource {
  thumbnail: string;
  map?: string;
  lifechart?: string;
}

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

  return { ...sp, ...speciesResources[sp.id], images, country };
};

const extendedSpecies = (species as Species[]).map(extendWithResources);

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

export default extendedSpecies;
