import {
  Sample,
  SampleAttrs,
  SampleOptions,
  getDeepErrorMessage,
  device,
  useAlert,
} from '@flumens';
import userModel from 'models/user';
import config from 'common/config';
import pointSurvey from 'Survey/Point/config';
import listSurvey from 'Survey/List/config';
import timeSurvey from 'Survey/Time/config';
import { Species } from 'common/data/species';
import GPSExtension from './sampleGPSExt';
import BackgroundGPSExtension from './sampleBackgroundGPSExt';
import MetOfficeExtension from './sampleMetofficeExt';
import { modelStore } from './store';
import Occurrence from './occurrence';
import Media from './image';

type Attrs = SampleAttrs & {
  date: any;
  location: any;
  stage: any;
  duration: any;
  startTime: any;
  comment: any;
  sun: any;
  temperature: any;
  windDirection: any;
  windSpeed: any;
};

const surveyConfig = {
  point: pointSurvey,
  list: listSurvey,
  'single-species-count': timeSurvey,
};

class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  store = modelStore;

  attrs: Attrs = this.attrs;

  gpsExtensionInit: any; // from extension

  backgroundGPSExtensionInit: any; // from extension

  stopGPS: any; // from extension

  stopBackgroundGPS: any; // from extension

  setAreaLocation: any; // from extension

  isGPSRunning: any; // from extension

  toggleBackgroundGPS: any; // from extension

  hasLoctionMissingAndIsnotLocating: any; // from extension

  isBackgroundGPSRunning: any; // from extension

  constructor(props: SampleOptions) {
    super(props);
    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });

    this.survey =
      surveyConfig[this.metadata.survey as keyof typeof surveyConfig];

    Object.assign(this, GPSExtension);
    Object.assign(this, BackgroundGPSExtension);
    Object.assign(this, MetOfficeExtension);

    this.gpsExtensionInit();
    this.backgroundGPSExtensionInit();
  }

  hasZeroAbundance() {
    if (this.parent) {
      return this.parent.samples[0].occurrences[0].attrs.zero_abundance;
    }

    return this.samples[0]?.occurrences[0]?.attrs?.zero_abundance;
  }

  destroy(silent?: boolean) {
    this.cleanUp();
    return super.destroy(silent);
  }

  cleanUp() {
    this.stopGPS();
    this.stopBackgroundGPS();

    const stopGPS = (smp: AppSample) => {
      smp.stopGPS();
      smp.stopBackgroundGPS();
    };
    this.samples.forEach(stopGPS);
  }

  isTimerPaused() {
    return !!this.metadata.timerPausedTime;
  }

  isSurveySingleSpeciesTimedCount() {
    return this.metadata.survey === 'single-species-count';
  }

  getCurrentEditRoute() {
    if (!this.isSurveySingleSpeciesTimedCount())
      return `/survey/${this.metadata.survey}/${this.cid}`;

    const hasTaxonBeenSelected = this.samples.length;
    if (!hasTaxonBeenSelected) {
      return `/survey/${this.metadata.survey}/${this.cid}/species`;
    }

    const hasTimerStarted = this.attrs.startTime;
    if (!hasTimerStarted) {
      return `/survey/${this.metadata.survey}/${this.cid}/details`;
    }

    return `/survey/${this.metadata.survey}/${this.cid}`;
  }

  async upload(skipRefreshUploadCountStat?: boolean) {
    if (this.remote.synchronising || this.isUploaded()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    const isActivated = await userModel.checkActivation();
    if (!isActivated) return false;

    this.cleanUp();

    const refreshUploadCountStatWrap = () => {
      if (skipRefreshUploadCountStat) return;
      userModel.refreshUploadCountStat();
    };

    return this.saveRemote().then(refreshUploadCountStatWrap);
  }

  setSpecies(species: Species, occurrence: Occurrence) {
    const survey = this.getSurvey();

    if (survey.name === 'point') {
      this.occurrences[0].attrs.taxon = species; // eslint-disable-line
    }

    if (survey.name === 'single-species-count') {
      const zeroAbundance = 't';
      const { stage } = this.attrs;
      const newSubSample = survey.smp.create(
        AppSample,
        Occurrence,
        species,
        zeroAbundance,
        stage
      );

      this.samples.push(newSubSample);

      return this.getCurrentEditRoute();
    }

    if (survey.name === 'list') {
      if (occurrence) {
        occurrence.attrs.taxon = species; // eslint-disable-line
      } else {
        const occ = survey.occ.create(Occurrence, species);
        this.occurrences.push(occ);
      }
    }

    return '';
  }

  hasOccurrencesBeenVerified() {
    const hasBeenVerified = (occ: Occurrence) => {
      const isRecordInReview =
        occ.metadata?.verification?.verification_status === 'C' &&
        occ.metadata?.verification?.verification_substatus !== '3';

      return occ.metadata?.verification && !isRecordInReview;
    };

    const hasSubSample = this.samples.length;
    if (hasSubSample) {
      let status;

      const getSamples = (subSample: Sample) => {
        status =
          this.isUploaded() && !!subSample.occurrences.some(hasBeenVerified);
        return status;
      };

      this.samples.some(getSamples);
      return this.isUploaded() && !!status;
    }

    return this.isUploaded() && !!this.occurrences.some(hasBeenVerified);
  }

  getSurveySpeciesFilters() {
    const survey = this.getSurvey();
    if (survey.name === 'single-species-count') {
      return {
        survey: ['single-species-count'],
      };
    }

    return null;
  }
}

export const useValidateCheck = (sample: Sample) => {
  const alert = useAlert();

  const validate = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      alert({
        header: 'Survey incomplete',
        message: getDeepErrorMessage(invalids),
        buttons: [
          {
            text: 'Got it',
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };

  return validate;
};

export default AppSample;
