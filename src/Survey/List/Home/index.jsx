import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, showInvalidsMessage, device, toast, alert } from '@apps';
import { observer } from 'mobx-react';
import { IonButton, NavContext } from '@ionic/react';
import Main from './Main';
import './styles.scss';

const { warn } = toast;

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

function Home({ appModel, userModel, match, sample }) {
  const { navigate } = useContext(NavContext);

  if (!sample) {
    return null;
  }

  const _processSubmission = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    if (!device.isOnline()) {
      warn('Looks like you are offline!');
      return;
    }

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      navigate(`/user/register`);
      return;
    }

    sample.saveRemote();

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
        match={match}
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
  match: PropTypes.object,
  location: PropTypes.object, // eslint-disable-line
  history: PropTypes.object, // eslint-disable-line
  appModel: PropTypes.object.isRequired,
  userModel: PropTypes.object.isRequired,
  sample: PropTypes.object.isRequired,
});

export default observer(Home);