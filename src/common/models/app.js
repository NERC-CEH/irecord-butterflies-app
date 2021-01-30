import { Model } from '@apps';
import { genericStore } from './store';

class AppModel extends Model {}

const defaults = {
  sendAnalytics: true,
  appSession: 0,

  // tips
  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,
};

const appModel = new AppModel(genericStore, 'app', defaults);

export { appModel as default, AppModel };
