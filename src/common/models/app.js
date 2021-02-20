import { Model } from '@apps';
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
}

const defaults = {
  sendAnalytics: true,
  appSession: 0,

  // draft survey pointers
  'draftId:point': null,

  // tips
  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,

  filters: {},
};

const appModel = new AppModel(genericStore, 'app', defaults);

export { appModel as default, AppModel };
