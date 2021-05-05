import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import { alert } from '@apps';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import savedSamples from 'models/savedSamples';

async function showDraftAlert() {
  const alertWrap = resolve => {
    alert({
      header: 'Unfinished record',
      message:
        'You have an incomplete record than needs to be saved before starting another one. Would you like to continue it?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Discard',
          handler: () => {
            resolve(false);
          },
        },
        {
          text: 'Continue',
          cssClass: 'primary',
          handler: () => {
            resolve(true);
          },
        },
      ],
    });
  };
  return new Promise(alertWrap);
}

async function getNewSample(survey, draftIdKey, params) {
  const toParam = (agg, v) => {
    const [key, val] = v.split('=');
    return { ...agg, [key]: val };
  };
  const options = params.replace('?', '').split('&').reduce(toParam, {});
  const sample = await survey.create(Sample, Occurrence, options);
  await sample.save();

  savedSamples.push(sample);
  appModel.attrs[draftIdKey] = sample.cid;
  await appModel.save();

  return sample;
}

async function getDraft(draftIdKey) {
  const draftID = appModel.attrs[draftIdKey];
  if (draftID) {
    const byId = ({ cid }) => cid === draftID;
    const draftSample = savedSamples.find(byId);
    if (draftSample) {
      const continueDraftRecord = await showDraftAlert();
      if (continueDraftRecord) {
        return draftSample;
      }

      draftSample.destroy();
    }
  }

  return null;
}

function StartNewSurvey({ survey, location }) {
  const match = useRouteMatch();
  const context = useContext(NavContext);

  const draftIdKey = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    // eslint-disable-next-line
    (async () => {
      let sample = await getDraft(draftIdKey);
      if (!sample) {
        sample = await getNewSample(survey, draftIdKey, location.search);
      }

      const url = `${match.url}/${sample.cid}`;
      context.navigate(url, 'none', 'replace');
    })();
  };

  useEffect(pickDraftOrCreateSampleWrap, [match.url]);

  return null;
}

StartNewSurvey.propTypes = exact({
  survey: PropTypes.object.isRequired,
  location: PropTypes.any,
});

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = survey => {
  const StartNewSurveyWrap = (
    { location } // eslint-disable-line
  ) => <StartNewSurvey survey={survey} location={location} />;

  return StartNewSurveyWrap;
};

export default StartNewSurvey;
