import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import {
  Page,
  Header,
  useAlert,
  useToast,
  useSample,
  useRemoteSample,
} from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import userModel, { useUserStatusCheck } from 'models/user';
import SurveyHeaderButton from 'Survey/common/Components/SurveyHeaderButton';
import Main from './Main';
import buttonWithExplanationImage from './buttonWithExplanationImage.png';
import './styles.scss';

function showListSurveyHiddenButtonTip(alert: any) {
  alert({
    header: 'List survey tip',
    message: (
      <div>
        <ol>
          <li>
            <p>Tap to increase the count.</p>
          </li>
          <li>
            <p>Tap to see more options.</p>
          </li>
        </ol>
        <img src={buttonWithExplanationImage} />
      </div>
    ),
    buttons: [{ text: 'OK, got it' }],
  });
}

function showListSurveyTip(alert: any) {
  alert({
    header: 'List survey',
    message: (
      <>
        <p>
          Use this to record all of the butterflies you see during a walk/survey
          of a site. You can build up a list of the species seen and alter the
          count of each by tapping on the number as you go along.
        </p>

        <p>
          First you must set a spatial reference for your survey sightings. You
          can choose a precise point to represent the whole site (appropriate
          for small areas) or select a larger grid square size in order to
          encompass a larger site.
        </p>

        <p>
          Alternatively, if you are recording over a large area, you may want to
          undertake separate surveys (i.e. go through the app recording process
          several times) for different parts of the site or for different 1km
          grid squares.
        </p>
      </>
    ),
    buttons: [{ text: 'OK, got it' }],
  });
}
function increaseCount(occ: Occurrence, is5x: boolean) {
  const addOneCount = () => (occ.data.count as number)++; // eslint-disable-line no-param-reassign

  if (is5x) {
    [...Array(5)].forEach(addOneCount);
  } else {
    addOneCount();
  }

  occ.save();
}

function deleteOccurrence(occ: Occurrence, alert: any) {
  const { commonName } = occ.data.taxon;

  alert({
    header: 'Delete',
    message: `Are you sure you want to delete ${commonName}?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          occ.destroy();
        },
      },
    ],
  });
}

const Home = () => {
  const match = useRouteMatch();
  const alert = useAlert();
  const toast = useToast();
  const { navigate } = useContext(NavContext);

  let { sample } = useSample<Sample>();
  sample = useRemoteSample(sample, () => userModel.isLoggedIn(), Sample);

  const checkSampleStatus = useValidateCheck(sample);

  const checkUserStatus = useUserStatusCheck();

  const showListSurveyTipOnce = () => {
    if (appModel.data.showListSurveyTip) {
      appModel.data.showListSurveyTip = false; // eslint-disable-line

      appModel.save();
      showListSurveyTip(alert);
    }

    const firstOccAdded = sample?.occurrences.length === 1;
    if (appModel.data.showListSurveyHiddenButtonTip && firstOccAdded) {
      appModel.data.showListSurveyHiddenButtonTip = false; // eslint-disable-line

      appModel.save();
      showListSurveyHiddenButtonTip(alert);
    }
  };

  useEffect(showListSurveyTipOnce);

  if (!sample) return null;
  console.log(sample);

  const _processSubmission = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    sample.upload().catch(toast.error);
    navigate(`/home/surveys`, 'root');
  };

  const _processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    appModel.data['draftId:list'] = null; // eslint-disable-line
    await appModel.save();

    sample.metadata.saved = true; // eslint-disable-line
    sample.save();

    navigate(`/home/surveys`, 'root');
  };

  const onFinish = async () => {
    if (!sample.metadata.saved) {
      await _processDraft();
      return;
    }

    await _processSubmission();
  };

  const isDisabled = sample.isUploaded;

  const navigateToOccurrence = (occ: Occurrence) => {
    navigate(`${match.url}/occ/${occ.cid}`);
  };

  const toggleSpeciesSort = () => {
    const { listSurveyListSortedByTime } = appModel.data;
    // eslint-disable-next-line
    appModel.data.listSurveyListSortedByTime = !listSurveyListSortedByTime;
    appModel.save();
  };

  const deleteOccurrenceWrap = (occ: Occurrence) =>
    deleteOccurrence(occ, alert);

  return (
    <Page id="survey-list-edit">
      <Header
        title="List survey"
        rightSlot={<SurveyHeaderButton onClick={onFinish} sample={sample} />}
        defaultHref="/home/surveys"
      />
      <Main
        sample={sample}
        isDisabled={isDisabled}
        onToggleSpeciesSort={toggleSpeciesSort}
        navigateToOccurrence={navigateToOccurrence}
        increaseCount={increaseCount}
        deleteOccurrence={deleteOccurrenceWrap}
        listSurveyListSortedByTime={appModel.data.listSurveyListSortedByTime}
      />
    </Page>
  );
};

export default observer(Home);
