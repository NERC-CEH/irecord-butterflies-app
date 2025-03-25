import { Model, ModelAttrs, locationToGrid } from '@flumens';
import { mainStore } from 'models/store';
import GPS from 'helpers/GPS';

export type FilterGroup =
  | 'colour'
  | 'markings'
  | 'size'
  | 'group'
  | 'country'
  | 'survey';
export type Filter = string;
export type Filters = {
  [key in FilterGroup]?: Filter[];
};

export interface Attrs extends ModelAttrs {
  sendAnalytics: boolean;
  appSession: 0;
  useProbabilitiesForGuide: boolean;
  useLocationForGuide: boolean;
  useSmartSorting: boolean;
  listSurveyListSortedByTime: boolean;
  useMoths: boolean;
  location: any;

  feedbackGiven: boolean;
  showedWelcome: boolean;

  // draft survey pointers
  'draftId:point': null;
  'draftId:list': null;
  'draftId:single-species-count': null;
  'draftId:multi-species-count': null;

  // tips
  showLocationGPSTip: boolean;
  showSurveysDeleteTip: boolean;
  showSurveyUploadTip: boolean;
  showListSurveyTip: boolean;
  showSpeciesDeleteTip: boolean;
  showSurveyOptionsTip: boolean;
  /**
   * @deprecated
   */
  showStatsWIPTip?: boolean;
  showListSurveyHiddenButtonTip: boolean;
  showTimeSurveyTip: boolean;
  showMothSpeciesTip: boolean;

  showWhatsNew: boolean;
  showWhatsNewInVersion250: boolean;

  showVerifiedRecordsNotification: boolean;
  verifiedRecordsTimestamp: null | number;
  useSpeciesImageClassifier: boolean;

  lastGroupId?: number | string;

  filters: Filters;
}

const defaults: Attrs = {
  sendAnalytics: true,
  appSession: 0,
  useProbabilitiesForGuide: true,
  useLocationForGuide: true,
  useSmartSorting: true,
  listSurveyListSortedByTime: false,
  useMoths: false,
  location: {},

  feedbackGiven: false,
  showedWelcome: false,
  useSpeciesImageClassifier: true,

  // draft survey pointers
  'draftId:point': null,
  'draftId:list': null,
  'draftId:single-species-count': null,
  'draftId:multi-species-count': null,

  // tips
  showLocationGPSTip: true,
  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,
  showListSurveyTip: true,
  showSpeciesDeleteTip: true,
  showListSurveyHiddenButtonTip: true,
  showTimeSurveyTip: true,
  showMothSpeciesTip: true,
  showSurveyOptionsTip: true,

  showVerifiedRecordsNotification: true,
  verifiedRecordsTimestamp: null,

  showWhatsNew: true,
  showWhatsNewInVersion250: true,

  filters: {},
};

export class AppModel extends Model<Attrs> {
  _gettingLocation?: string;

  constructor(options: any) {
    super({ ...options, data: { ...defaults, ...options.data } });
  }

  // eslint-disable-next-line @getify/proper-arrows/name
  toggleFilter = (type: FilterGroup, value: Filter) => {
    const { filters } = this.data;
    if (!filters[type]) {
      filters[type] = [];
    }

    const foundIndex = filters[type]?.indexOf(value) as number;
    if (foundIndex >= 0) {
      filters[type]?.splice(foundIndex, 1);
    } else {
      filters[type]?.unshift(value);
    }

    this.save();
  };

  // eslint-disable-next-line @getify/proper-arrows/name
  updateCurrentLocation = async (stop?: boolean) => {
    if (stop) {
      if (!this._gettingLocation) {
        return;
      }

      GPS.stop(this._gettingLocation);
      return;
    }

    if (!this.data.useLocationForGuide) {
      return;
    }

    console.log('AppModel: asking for location.');

    const onGPSSuccess = (err: Error, newLocation: any) => {
      if (err) {
        GPS.stop(this._gettingLocation);
        return;
      }

      if (!this.data.useLocationForGuide) {
        console.log(
          'AppModel: setting new location skipped - disabled setting.'
        );
        return;
      }

      console.log('AppModel: setting new location.');

      // eslint-disable-next-line
      newLocation.accuracy = 1000000; // make it hectad
      newLocation.gridref = locationToGrid(newLocation); // eslint-disable-line
      this.data.location = newLocation;
      this.save();

      GPS.stop(this._gettingLocation);
    };

    this._gettingLocation = await GPS.start({ callback: onGPSSuccess });
  };

  resetDefaults() {
    return super.reset(defaults);
  }
}

const appModel = new AppModel({ cid: 'app', store: mainStore });
export default appModel;
