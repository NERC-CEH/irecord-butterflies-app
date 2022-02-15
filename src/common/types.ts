export interface Image {
  speciesID: string;
  file: string;
  author: string;
  title: string;
}

export interface Species {
  id: string;
  type: string;
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
  webLink: string;
  thumbnail: string;
  map: string;
  lifechart: string;
  images: Image[];
  country: string[];
}
