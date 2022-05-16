import { Species } from 'common/data/species';
import { Filters } from 'models/app.d';
import occurrenceModel from './occurrence';

declare const appModel: {
  new (obj: any): MyInterface;

  _init: any;

  id: string | number;
  cid: string;

  attrs: any;
  metadata: any;

  remote: {
    synchronising: boolean;
  };

  samples: appModel[];

  occurrences: occurrenceModel[];

  isGPSRunning: () => boolean;
  toggleGPStracking: (state: boolean) => void;
  setAreaLocation: (shape: number) => void;
  isUploaded: () => boolean;
  hasZeroAbundance: () => boolean;
  destroy: () => void;
  save: () => void;
  upload: (
    skipInvalidsMessage?: boolean,
    skipRefreshUploadCountStat?: boolean,
    skipActivationCheckForUploadAll?: boolean
  ) => Promise<boolean>;

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
  cleanUp: () => void;
  setSpecies: (species: Species, occurrence?: occurrenceModel) => string;
  isSurveySingleSpeciesTimedCount: () => boolean;
  uploadAll: any;
  getSurveySpeciesFilters: () => null | Filters;
  hasOccurrencesBeenVerified: () => boolean;
  getCurrentEditRoute: () => string;
};

export function useValidateCheck(arg: any): any;

export default appModel;
