import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, showInvalidsMessage } from '@apps';
import { observer } from 'mobx-react';
import { IonButton, NavContext } from '@ionic/react';
import Main from './Main';
import './styles.scss';

@observer
class Controller extends React.Component {
  static contextType = NavContext;

  static propTypes = exact({
    appModel: PropTypes.object.isRequired,
    userModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  });

  _processSubmission = () => {
    const { sample, userModel } = this.props;

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      this.context.navigate(`/user/login`);
      return;
    }

    sample.upload();
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
    const { sample } = this.props;

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
        <Main sample={sample} isDisabled={isDisabled} />
      </Page>
    );
  }
}

export default Controller;
