import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { useRouteMatch } from 'react-router';
import { Page, Header, showInvalidsMessage, alert } from '@apps';
import { observer } from 'mobx-react';
import { IonButton, NavContext } from '@ionic/react';
import Main from './Main';
import buttonWithExplanationImage from './buttonWithExplanationImage.png';
import './styles.scss';

function showListSurveyHiddenButtonTip() {
  alert({
    header: 'List survey tip',
    message: (
      <>
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
      </>
    ),
    buttons: [{ text: 'OK, got it' }],
  });
}

function showListSurveyTip() {
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
function increaseCount(occ) {
  occ.attrs.count++; // eslint-disable-line no-param-reassign
  occ.save();
}

function deleteOccurrence(occ) {
  const { commonName } = occ.attrs.taxon;

  alert({
    header: 'Delete',
    message: `Are you sure you want to delete ${commonName}?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: 'Delete',
        cssClass: 'secondary',
        handler: () => {
          occ.destroy();
        },
      },
    ],
  });
}

function Home({ appModel, userModel, sample }) {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const showListSurveyTipOnce = () => {
    if (appModel.attrs.showListSurveyTip) {
      appModel.attrs.showListSurveyTip = false; // eslint-disable-line

      appModel.save();
      showListSurveyTip();
    }

    const firstOccAdded = sample.occurrences.length === 1;
    if (appModel.attrs.showListSurveyHiddenButtonTip && firstOccAdded) {
      appModel.attrs.showListSurveyHiddenButtonTip = false; // eslint-disable-line

      appModel.save();
      showListSurveyHiddenButtonTip();
    }
  };

  useEffect(showListSurveyTipOnce);

  if (!sample) {
    return null;
  }

  const _processSubmission = () => {
    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      navigate(`/user/register`);
      return;
    }

    sample.upload();
    navigate(`/home/surveys`, 'root');
  };

  const _processDraft = async () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

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

  const navigateToOccurrence = occ => {
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
        deleteOccurrence={deleteOccurrence}
        listSurveyListSortedByTime={appModel.attrs.listSurveyListSortedByTime}
      />
    </Page>
  );
}

Home.propTypes = exact({
  appModel: PropTypes.object.isRequired,
  userModel: PropTypes.object.isRequired,
  sample: PropTypes.object.isRequired,
});

export default observer(Home);
