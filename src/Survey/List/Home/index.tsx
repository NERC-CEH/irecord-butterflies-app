import { FC, useContext, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import { Page, Header, useAlert, useToast } from '@flumens';
import { observer } from 'mobx-react';
import appModel from 'models/app';
import Occurrence from 'models/occurrence';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import { IonButton, NavContext } from '@ionic/react';
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
  const addOneCount = () => (occ.attrs.count as number)++; // eslint-disable-line no-param-reassign

  if (is5x) {
    [...Array(5)].forEach(addOneCount);
  } else {
    addOneCount();
  }

  occ.save();
}

function deleteOccurrence(occ: Occurrence, alert: any) {
  const { commonName } = occ.attrs.taxon;

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

type Props = {
  sample: Sample;
};

const Home: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const alert = useAlert();
  const toast = useToast();
  const { navigate } = useContext(NavContext);
  const checkSampleStatus = useValidateCheck(sample);

  const checkUserStatus = useUserStatusCheck();

  const showListSurveyTipOnce = () => {
    if (appModel.attrs.showListSurveyTip) {
      appModel.attrs.showListSurveyTip = false; // eslint-disable-line

      appModel.save();
      showListSurveyTip(alert);
    }

    const firstOccAdded = sample.occurrences.length === 1;
    if (appModel.attrs.showListSurveyHiddenButtonTip && firstOccAdded) {
      appModel.attrs.showListSurveyHiddenButtonTip = false; // eslint-disable-line

      appModel.save();
      showListSurveyHiddenButtonTip(alert);
    }
  };

  useEffect(showListSurveyTipOnce);

  if (!sample) {
    return null;
  }

  const _processSubmission = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    sample.upload().catch(toast.error);
    navigate(`/home/surveys`, 'root');
  };

  const _processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    appModel.attrs['draftId:list'] = null; // eslint-disable-line
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

  const isEditing = sample.metadata.saved;

  const isDisabled = sample.isUploaded();

  const navigateToOccurrence = (occ: Occurrence) => {
    navigate(`${match.url}/occ/${occ.cid}`);
  };

  const toggleSpeciesSort = () => {
    const { listSurveyListSortedByTime } = appModel.attrs;
    // eslint-disable-next-line
    appModel.attrs.listSurveyListSortedByTime = !listSurveyListSortedByTime;
    appModel.save();
  };

  const finishButton = isDisabled ? null : (
    <IonButton onClick={onFinish} color="primary" fill="solid" shape="round">
      {isEditing ? 'Upload' : 'Finish'}
    </IonButton>
  );

  const deleteOccurrenceWrap = (occ: Occurrence) =>
    deleteOccurrence(occ, alert);

  return (
    <Page id="survey-list-edit">
      <Header
        title="New List"
        rightSlot={finishButton}
        defaultHref="/home/surveys"
      />
      <Main
        sample={sample}
        isDisabled={isDisabled}
        onToggleSpeciesSort={toggleSpeciesSort}
        navigateToOccurrence={navigateToOccurrence}
        increaseCount={increaseCount}
        deleteOccurrence={deleteOccurrenceWrap}
        listSurveyListSortedByTime={appModel.attrs.listSurveyListSortedByTime}
      />
    </Page>
  );
};

export default observer(Home);
