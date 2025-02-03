import { useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router';
import { useAlert, useDisableBackButton } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import savedSamples from 'models/collections/samples';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

async function showDraftAlert(
  alert: (arg0: {
    header: string;
    message: string;
    backdropDismiss: boolean;
    buttons: (
      | { text: string; role: string; handler: () => void }
      | { text: string; handler: () => void; role?: undefined }
    )[];
  }) => void
) {
  const alertWrap = (resolve: (arg0: boolean) => void) => {
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

async function getNewSample(
  survey: any,
  draftIdKey: string,
  params: string
): Promise<Sample> {
  const toParam = (agg: any, v: any) => {
    const [key, val] = v.split('=');
    return { ...agg, [key]: val };
  };
  const options = params.replace('?', '').split('&').reduce(toParam, {});
  const sample = await survey.create({ Sample, Occurrence, ...options });
  await sample.save();

  savedSamples.push(sample);
  (appModel as any).attrs[draftIdKey] = sample.cid;
  await appModel.save();

  return sample;
}

async function getDraft(draftIdKey: string, alert: any) {
  const draftID = (appModel as any).attrs[draftIdKey];
  if (draftID) {
    const byId = ({ cid }: any) => cid === draftID;
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

function StartNewSurvey({ survey, location }: any) {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  useDisableBackButton();

  const draftIdKey = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    // eslint-disable-next-line
    (async () => {
      let sample: Sample = await getDraft(draftIdKey, alert);
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

// eslint-disable-next-line @getify/proper-arrows/name
StartNewSurvey.with = (survey: any) => {
  const StartNewSurveyWrap = ({ location }: any) => (
    <StartNewSurvey survey={survey} location={location} />
  );

  return StartNewSurveyWrap;
};

export default StartNewSurvey;
