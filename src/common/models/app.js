import { Model, locationToGrid } from '@apps';
import GPS from 'helpers/GPS';
import { genericStore } from './store';

class AppModel extends Model {
  toggleFilter = (type, value) => {
    const { filters } = this.attrs;

    if (!filters[type]) {
      filters[type] = [];
    }

    const foundIndex = filters[type].indexOf(value);
    if (foundIndex >= 0) {
      filters[type].splice(foundIndex, 1);
    } else {
      filters[type].unshift(value);
    }

    this.save();
  };

  updateCurrentLocation = async stop => {
    if (stop) {
      if (!this._gettingLocation) {
        return;
      }

      GPS.stop(this._gettingLocation);
      return;
    }

    if (!this.attrs.useLocationForGuide) {
      return;
    }

    console.log('AppModel: asking for location.');

    const onGPSSuccess = (err, newLocation) => {
      if (err) {
        GPS.stop(this._gettingLocation);
        return;
      }

      if (!this.attrs.useLocationForGuide) {
        console.log(
          'AppModel: setting new location skipped - disabled setting.'
        );
        return;
      }

      console.log('AppModel: setting new location.');

      // eslint-disable-next-line
      newLocation.accuracy = 1000000; // make it hectad
      newLocation.gridref = locationToGrid(newLocation); // eslint-disable-line
      this.attrs.location = newLocation;
      this.save();

      GPS.stop(this._gettingLocation);
    };

    this._gettingLocation = await GPS.start({ callback: onGPSSuccess });
  };
}

const defaults = {
  sendAnalytics: true,
  appSession: 0,
  useProbabilitiesForGuide: true,
  useLocationForGuide: true,
  useSmartSorting: true,
  listSurveyListSortedByTime: false,
  useMoths: false,
  location: '',

  feedbackGiven: false,
  showedWelcome: false,

  // draft survey pointers
  'draftId:point': null,

  // tips
  showLocationGPSTip: true,
  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,
  showLongPressTip: true,
  showListSurveyTip: true,
  showSpeciesDeleteTip: true,
  showStatsWIPTip: true,
  showListSurveyHiddenButtonTip: true,
  showTimeSurveyTip: true,

  showVerifiedRecordsNotification: true,
  verifiedRecordsTimestamp: null,

  filters: {},
};

const appModel = new AppModel(genericStore, 'app', defaults);

export { appModel as default, AppModel };
