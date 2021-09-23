import { Sample, showInvalidsMessage, device, toast } from '@apps';
import userModel from 'models/user';
import config from 'common/config';
import { observable } from 'mobx';
import pointSurvey from 'Survey/Point/config';
import listSurvey from 'Survey/List/config';
import GPSExtension from './sampleGPSExt';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

const { warn, error } = toast;

const surveyConfig = {
  point: pointSurvey,
  list: listSurvey,
};

class AppSample extends Sample {
  static fromJSON(json) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  store = modelStore;

  constructor(...args) {
    super(...args);

    this.remote = observable({
      api_key: config.backend.apiKey,
      host_url: `${config.backend.url}/`,
      user: userModel.getUser.bind(userModel),
      password: userModel.getPassword.bind(userModel),
      synchronising: false,
    });

    this.survey = surveyConfig[this.metadata.survey];

    Object.assign(this, GPSExtension);
    this.gpsExtensionInit();
  }

  upload(skipInvalidsMessage) {
    if (this.remote.synchronising) {
      return;
    }

    const invalids = this.validateRemote();
    if (invalids) {
      !skipInvalidsMessage && showInvalidsMessage(invalids);
      return;
    }

    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const showError = e => {
      if (e.message === 'Could not find/authenticate user.\n') {
        // TODO: remove once it is clear why this happens.
        console.error(
          'Unauthenticated: userModel has credentials:',
          userModel.attrs.email && 'email',
          userModel.attrs.password && 'password'
        );
        error(
          "For some reason we couldn't authenticate your account. Try logging out and back into the app.",
          4000
        );
      } else {
        error(e);
      }
      throw e;
    };


     const storeTemporarilyUserStats = async () => {
       try {
         await userModel.fetchStats();
         // we store this temporarily because to use the stats thank you message only after upload action instead of stats page refresh
         userModel.uploadCounter.count = userModel.attrs?.stats?.myProjectRecordsThisYear;
       } catch (e) {
         // skip showing stats error to the user - less important than upload errors
         console.error(e);
       }

     };
    this.saveRemote().then(storeTemporarilyUserStats).catch(showError)
  }
}

export default AppSample;
