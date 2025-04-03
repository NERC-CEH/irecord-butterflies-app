import { IObservableArray } from 'mobx';
import { useTranslation } from 'react-i18next';
import {
  Sample as SampleOriginal,
  SampleAttrs,
  SampleOptions,
  SampleMetadata,
  ModelValidationMessage,
  device,
  useAlert,
  ElasticSample,
} from '@flumens';
import config from 'common/config';
import speciesProfiles, { Species } from 'common/data/species';
import userModel from 'models/user';
import listSurvey from 'Survey/List/config';
import pointSurvey from 'Survey/Point/config';
import multiSurvey from 'Survey/Time/Multi/config';
import timeSurvey from 'Survey/Time/Single/config';
import { Survey } from 'Survey/common/config';
import { getSurveyConfigs } from 'Survey/common/surveyConfigs';
import Media from '../image';
import Occurrence from '../occurrence';
import { samplesStore } from '../store';
import BackgroundGPSExtension, {
  calculateArea,
} from './sampleBackgroundGPSExt';
import GPSExtension from './sampleGPSExt';
import MetOfficeExtension from './sampleMetofficeExt';
import VibrateExtension from './vibrateExt';

type Attrs = SampleAttrs & {
  surveyId: any;
  locationId?: any;
  date?: any;
  location: any;
  stage?: any;
  duration?: any;
  startTime?: any;
  comment?: any;
  sun?: any;
  temperature?: any;
  windDirection?: any;
  windSpeed?: any;
  cloud?: any;
  device?: any;
  appVersion?: any;
  recorders?: number;
  groupId?: string;
};

type Metadata = SampleMetadata & {
  /**
   * The time when the timer was paused.
   */
  timerPausedTime?: Date;
  /**
   * How long the survey was paused in milliseconds.
   */
  pausedTime: number;
  saved?: number | boolean;
};

export default class Sample extends SampleOriginal<Attrs, Metadata> {
  static fromElasticDTO(json: ElasticSample, options: any, survey?: any) {
    const parsed = super.fromElasticDTO(json, options, survey) as any;
    if (parsed.data?.location?.shape) {
      parsed.data.location.area = calculateArea(parsed.data?.location?.shape);
    }

    return parsed;
  }

  declare occurrences: IObservableArray<Occurrence>;

  declare samples: IObservableArray<Sample>;

  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  startMetOfficePull: any; // from extension

  gpsExtensionInit: any; // from extension

  backgroundGPSExtensionInit: any; // from extension

  startGPS: any; // from extension

  stopGPS: any; // from extension

  setAreaLocation: any; // from extension

  isGPSRunning: any; // from extension

  gps: any; // from extension

  startBackgroundGPS: any; // from extension

  stopBackgroundGPS: any; // from extension

  toggleBackgroundGPS: any; // from extension

  hasLoctionMissingAndIsnotLocating: any; // from extension

  isBackgroundGPSRunning: any; // from extension

  startVibrateCounter: any; // from extension

  stopVibrateCounter: any; // from extension

  constructor(options: SampleOptions<Attrs>) {
    super({ ...options, Occurrence, Media, store: samplesStore });

    this.remote.url = config.backend.indicia.url;
    this.remote.getAccessToken = () => userModel.getAccessToken();

    Object.assign(this, GPSExtension);
    Object.assign(this, BackgroundGPSExtension);
    Object.assign(this, MetOfficeExtension);
    Object.assign(this, VibrateExtension);

    this.gpsExtensionInit();
    this.backgroundGPSExtensionInit();
  }

  hasZeroAbundance(id?: string) {
    const hasZeroAbundance: any = (smp: Sample) =>
      smp?.occurrences[0]?.hasZeroAbundance();

    if (this.parent) return hasZeroAbundance(this);

    if (id) {
      const byTaxonId = (smp: Sample) =>
        smp.occurrences[0].data.taxon.id === id;
      const smp = this.samples.find(byTaxonId)!;
      return hasZeroAbundance(smp);
    }

    return !this.samples.some(hasZeroAbundance);
  }

  destroy(silent?: boolean) {
    this.cleanUp();
    return super.destroy(silent);
  }

  cleanUp() {
    this.stopGPS();
    this.stopBackgroundGPS();
    this.stopVibrateCounter();

    const stopGPS = (smp: Sample) => {
      smp.stopGPS();
      smp.stopBackgroundGPS();
    };
    this.samples.forEach(stopGPS);
  }

  isTimerPaused() {
    return !!this.metadata.timerPausedTime;
  }

  getTimerEndTime = () => {
    const startTime = new Date(this.data.startTime!);
    const DEFAULT_SURVEY_TIME = 15 * 60 * 1000; // 15 mins

    return (
      startTime.getTime() + DEFAULT_SURVEY_TIME + this.metadata.pausedTime!
    );
  };

  isTimerFinished = () => {
    if (this.isTimerPaused()) return false;

    return this.getTimerEndTime() < new Date().getTime();
  };

  isSurveySingleSpeciesTimedCount() {
    // eslint-disable-next-line eqeqeq
    return this.data.surveyId == timeSurvey.id;
  }

  isSurveyMultiSpeciesTimedCount() {
    // eslint-disable-next-line eqeqeq
    return this.data.surveyId == multiSurvey.id;
  }

  getCurrentEditRoute() {
    const hasTimerStarted = this.data.startTime;
    const surveyName = this.getSurvey().name;

    if (this.isSurveyMultiSpeciesTimedCount()) {
      return `/survey/${surveyName}/${this.id || this.cid}`;
    }

    if (!this.isSurveySingleSpeciesTimedCount())
      return `/survey/${surveyName}/${this.id || this.cid}`;

    const hasTaxonBeenSelected = this.samples.length;
    if (this.isStored && !hasTaxonBeenSelected) {
      return `/survey/${surveyName}/${this.id || this.cid}/species`;
    }

    if (this.isStored && !hasTimerStarted) {
      return `/survey/${surveyName}/${this.id || this.cid}/details`;
    }

    return `/survey/${surveyName}/${this.id || this.cid}`;
  }

  async upload(skipRefreshUploadCountStat?: boolean) {
    if (this.isSynchronising || this.isUploaded) return true;

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

  getSurvey() {
    let { surveyId } = this.data;

    // backwards compatible, remove once everyone uploads their surveys
    if ((this.metadata as any).survey) {
      if ((this.metadata as any).survey === 'point') surveyId = pointSurvey.id;
      if ((this.metadata as any).survey === 'list') surveyId = listSurvey.id;
      if ((this.metadata as any).survey === 'single-species-count')
        surveyId = timeSurvey.id;
      if ((this.metadata as any).survey === 'multi-species-count')
        surveyId = multiSurvey.id;

      if (!this.data.surveyId && !this.parent) {
        this.data.surveyId = surveyId;
      }
    }

    const survey = getSurveyConfigs()[surveyId];

    const isSubSample = this.parent;
    if (isSubSample) return (survey.smp || {}) as Survey;

    if (!survey) {
      console.log(JSON.stringify(this.metadata));
      console.log(JSON.stringify(this.data));
      console.error(`Survey config was missing`);
      return {} as Survey;
    }

    return survey as Survey;
  }

  async setSpecies(species: Species, occurrence: Occurrence): Promise<string> {
    const survey = this.getSurvey();
    if (survey.name === 'point') {
      this.occurrences[0].data.taxon = species; // eslint-disable-line
    }

    if (survey.name === 'single-species-count') {
      const zeroAbundance = 't';
      const { stage } = this.data;
      const newSubSample = await survey.smp!.create!({
        Sample,
        Occurrence,
        taxon: species,
        zeroAbundance,
        stage,
      });
      this.samples.push(newSubSample);

      const addConfusionSpecies = async (confusionSpeciesId: string) => {
        const byId = ({ id }: Species) => id === confusionSpeciesId;
        const confusionSpecies = speciesProfiles.find(byId);
        if (!confusionSpecies) {
          console.error(`Confusion species is missing: ${confusionSpeciesId}`);
          return;
        }

        const confSpeciesSample = await survey.smp!.create!({
          Sample,
          Occurrence,
          taxon: confusionSpecies,
          zeroAbundance,
          stage,
        });

        this.samples.push(confSpeciesSample);
      };
      species.confusionSpecies?.forEach(addConfusionSpecies);

      return this.getCurrentEditRoute();
    }

    if (survey.name === 'multi-species-count') {
      const { stage } = this.data;
      const newSubSample = await survey.smp!.create!({
        Sample,
        Occurrence,
        taxon: species,
        stage,
      });
      this.samples.push(newSubSample);

      return this.getCurrentEditRoute();
    }

    if (survey.name === 'list') {
      if (occurrence) {
        occurrence.data.taxon = species; // eslint-disable-line
      } else {
        const occ = await survey.occ!.create!({ Occurrence, taxon: species });
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
          this.isUploaded && !!subSample.occurrences.some(hasBeenVerified);
        return status;
      };

      this.samples.some(getSamples);
      return this.isUploaded && !!status;
    }

    return this.isUploaded && !!this.occurrences.some(hasBeenVerified);
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

export const useValidateCheck = (sample?: Sample) => {
  const alert = useAlert();
  const { t } = useTranslation();

  const showValidateCheck = () => {
    const invalids = sample?.validateRemote();
    if (invalids) {
      alert({
        header: t('Survey incomplete'),
        skipTranslation: true,
        message: <ModelValidationMessage {...invalids} />,
        buttons: [
          {
            text: t('Got it'),
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };

  return showValidateCheck;
};
