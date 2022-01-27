import occurrenceModel from './occurrence';

declare const appModel: {
  new (obj: any): MyInterface;

  _init: any;

  id: string | number;
  cid: string;

  attrs: any;
  metadata: any;

  samples: appModel[];

  occurrences: occurrenceModel[];

  isGPSRunning: () => boolean;
  toggleGPStracking: (state: boolean) => void;
  setAreaLocation: (shape: number) => void;
  isUploaded: () => boolean;
  hasZeroAbundance: () => boolean;
  destroy: () => void;
  save: () => void;

  // should return config
  getSurvey: () => any;
  validateRemote: () => any;

  hasLoctionMissingAndIsnotLocating: () => boolean;
};

export default appModel;
