import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, showInvalidsMessage, device, toast } from '@apps';
import { observer } from 'mobx-react';
import { IonButton, NavContext } from '@ionic/react';
import Main from './Main';
import './styles.scss';

const { warn } = toast;

@observer
class Controller extends React.Component {
  static contextType = NavContext;

  static propTypes = exact({
    match: PropTypes.object,
    location: PropTypes.object, // eslint-disable-line
    history: PropTypes.object, // eslint-disable-line
    appModel: PropTypes.object.isRequired,
    userModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  });

  _processSubmission = () => {
    const { sample, userModel } = this.props;

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
      this.context.navigate(`/user/register`);
      return;
    }

    sample.saveRemote();

    this.context.navigate(`/home/surveys`, 'root');
  };

  _processDraft = async () => {
    const { appModel, sample } = this.props;

    const invalids = sample.validateRemote();
    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    appModel.attrs['draftId:point'] = null;
    await appModel.save();

    sample.metadata.saved = true;
    sample.save();

    this.context.navigate(`/home/surveys`, 'root');
  };

  onFinish = async () => {
    const { sample } = this.props;

    if (!sample.metadata.saved) {
      await this._processDraft();
      return;
    }

    await this._processSubmission();
  };

  render() {
    const { appModel, match, sample } = this.props;

    if (!sample) {
      return null;
    }

    const isEditing = sample.metadata.saved;

    const isDisabled = sample.isUploaded();

    const finishButton = isDisabled ? null : (
      <IonButton
        onClick={this.onFinish}
        color="primary"
        fill="solid"
        shape="round"
      >
        {isEditing ? 'Upload' : 'Finish'}
      </IonButton>
    );

    return (
      <Page id="survey-point-edit">
        <Header
          title="New Sighting"
          rightSlot={finishButton}
          defaultHref="/home/surveys"
        />
        <Main
          match={match}
          sample={sample}
          appModel={appModel}
          url={match.url}
          photoSelect={this.photoSelect}
          isDisabled={isDisabled}
        />
      </Page>
    );
  }
}

export default Controller;
