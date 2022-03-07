import React from 'react';
import { Sample, showInvalidsMessage, device, toast, alert } from '@apps';
import { IonNote } from '@ionic/react';
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

  isSurveySingleSpeciesTimedCount = () =>
    this.metadata.survey === 'single-species-count';

  getCurrentEditRoute = () => {
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
  };

  async upload(
    skipInvalidsMessage,
    skipRefreshUploadCountStat,
    skipActivationCheckForUploadAll
  ) {
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

    if (!skipActivationCheckForUploadAll) {
      const isActivated = await userModel.checkActivation(true);
      if (!isActivated) {
        alert({
          message: (
            <>
              <IonNote color="warning">
                <b>Looks like your email hasn't been verified yet.</b>
              </IonNote>
              <p>Should we resend the verification email?</p>
            </>
          ),
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Resend',
              cssClass: 'primary',
              handler: () => userModel.resendVerificationEmail(),
            },
          ],
        });
        return false;
      }
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

  setSpecies(species, occurrence) {
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

  hasOccurrencesBeenVerified = () => {
    const hasBeenVerified = occ => {
      const isRecordInReview =
        occ.metadata?.verification?.verification_status === 'C' &&
        occ.metadata?.verification?.verification_substatus !== '3';

      return occ.metadata?.verification && !isRecordInReview;
    };

    const hasSubSample = this.samples.length;
    if (hasSubSample) {
      let status;

      const getSamples = subSample => {
        status =
          this.isUploaded() && !!subSample.occurrences.some(hasBeenVerified);
        return status;
      };

      this.samples.forEach(getSamples);
      return status;
    }

    return this.isUploaded() && !!this.occurrences.some(hasBeenVerified);
  };

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

export default AppSample;
