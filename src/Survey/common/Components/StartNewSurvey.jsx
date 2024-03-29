import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import { useAlert, useDisableBackButton } from '@flumens';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import savedSamples from 'models/savedSamples';

async function showDraftAlert(alert) {
  const alertWrap = resolve => {
    alert({
      header: 'Unfinished record',
      message:
        'You have an incomplete record that needs to be saved before starting another one. Would you like to continue it?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Discard',
          role: 'destructive',
          handler: () => {
            resolve(false);
          },
        },
        {
          text: 'Continue',
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

async function getDraft(draftIdKey, alert) {
  const draftID = appModel.attrs[draftIdKey];
  if (draftID) {
    const byId = ({ cid }) => cid === draftID;
    const draftSample = savedSamples.find(byId);
    if (draftSample) {
      const continueDraftRecord = await showDraftAlert(alert);
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
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  useDisableBackButton();

  const draftIdKey = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    // eslint-disable-next-line
    (async () => {
      let sample = await getDraft(draftIdKey, alert);
      if (!sample) {
        sample = await getNewSample(survey, draftIdKey, location.search);
      }

      const url = sample.getCurrentEditRoute();

      navigate(url, 'none', 'replace');
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
