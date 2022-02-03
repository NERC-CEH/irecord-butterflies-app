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
  upload: () => void;

  // should return config
  getSurvey: () => any;
  validateRemote: () => any;

  hasLoctionMissingAndIsnotLocating: () => boolean;

  // background GPS extension
  setAreaLocation: (
    shape: any,
    accuracy: any,
    altitude: any,
    altitudeAccuracy: any
  ) => any;
  toggleBackgroundGPS: (state?: any) => any;
  backgroundGPSExtensionInit: () => any;
  startBackgroundGPS: () => any;
  stopBackgroundGPS: () => any;
  isBackgroundGPSRunning: () => any;
  hasLoctionMissingAndIsnotLocating: () => any;
  isTimerPaused: () => boolean;
  startMetOfficePull: any;
};

export default appModel;
