import { Sample } from '@apps';
import userModel from 'models/user';
import config from 'common/config';
import pointSurvey from 'Survey/Point/config';
import GPSExtension from './sampleGPSExt';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

const surveyConfig = {
  point: pointSurvey,
};

class AppSample extends Sample {
  static fromJSON(json) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  store = modelStore;

  constructor(...args) {
    super(...args);

    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });

    this.survey = surveyConfig[this.metadata.survey];

    Object.assign(this, GPSExtension);
    this.gpsExtensionInit();
  }

  isDisabled = () => this.isUploaded();
}

export default AppSample;
