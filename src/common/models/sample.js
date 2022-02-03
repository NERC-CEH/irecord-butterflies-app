import { Sample, showInvalidsMessage, device, toast } from '@apps';
import userModel from 'models/user';
import config from 'common/config';
import pointSurvey from 'Survey/Point/config';
import listSurvey from 'Survey/List/config';
import timeSurvey from 'Survey/Time/config';
import GPSExtension from './sampleGPSExt';
import BackgroundGPSExtension from './sampleBackgroundGPSExt';
import MetOfficeExtension from './sampleMetofficeExt';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

const { warn, error } = toast;

const surveyConfig = {
  point: pointSurvey,
  list: listSurvey,
  'single-species-count': timeSurvey,
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
    Object.assign(this, BackgroundGPSExtension);
    Object.assign(this, MetOfficeExtension);

    this.gpsExtensionInit();
    this.backgroundGPSExtensionInit();
  }

  hasZeroAbundance = () => {
    if (this.parent) {
      return this.parent.samples[0].occurrences[0].attrs.zero_abundance;
    }

    return this.samples[0]?.occurrences[0]?.attrs?.zero_abundance;
  };

  destroy = () => {
    this.cleanUp();
    super.destroy();
  };

  cleanUp = () => {
    this.stopGPS();
    this.stopBackgroundGPS();

    const stopGPS = smp => {
      smp.stopGPS();
      smp.stopBackgroundGPS();
    };
    this.samples.forEach(stopGPS);
  };

  isTimerPaused = () => !!this.metadata.timerPausedTime;

  async upload(skipInvalidsMessage, skipRefreshUploadCountStat) {
    if (this.remote.synchronising) {
      return true;
    }

    const invalids = this.validateRemote();
    if (invalids) {
      !skipInvalidsMessage && showInvalidsMessage(invalids);
      return false;
    }

    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return false;
    }

    const isActivated = await userModel.checkActivation();
    if (!isActivated) {
      return false;
    }

    this.cleanUp();

    const showError = e => {
      error(e);
      throw e;
    };
    const refreshUploadCountStatWrap = () => {
      if (skipRefreshUploadCountStat) return;
      userModel.refreshUploadCountStat();
    };
    this.saveRemote().catch(showError).then(refreshUploadCountStatWrap);

    return true;
  }
}

export default AppSample;
