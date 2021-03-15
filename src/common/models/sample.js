import { Sample } from '@apps';
import userModel from 'models/user';
import config from 'common/config';
import { observable } from 'mobx';
import pointSurvey from 'Survey/Point/config';
import listSurvey from 'Survey/List/config';
import GPSExtension from './sampleGPSExt';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

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
}

export default AppSample;
