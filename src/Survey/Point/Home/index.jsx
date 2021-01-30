import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {
  Page,
  Header,
  toast,
  device,
  showInvalidsMessage,
  loader,
} from '@apps';
import { observer } from 'mobx-react';
import { IonButton } from '@ionic/react';
import i18n from 'i18next';
import Main from './Main';
import './styles.scss';

const { warn } = toast;

@observer
class Controller extends React.Component {
  static propTypes = exact({
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object, // eslint-disable-line
    appModel: PropTypes.object.isRequired,
    userModel: PropTypes.object.isRequired,
    sample: PropTypes.object.isRequired,
  });

  onUpload = async () => {
    const { sample, userModel, history, match } = this.props;

    const invalids = sample.validateRemote();

    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    if (!device.isOnline()) {
      warn(i18n.t('Looks like you are offline!'));
      return;
    }

    const isLoggedIn = !!userModel.attrs.id;
    if (!isLoggedIn) {
      warn(i18n.t('Please log in first to upload the records.'));
      return;
    }

    if (!userModel.attrs.verified) {
      await loader.show({
        message: i18n.t('Please wait...'),
      });

      try {
        await userModel.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!userModel.attrs.verified) {
        warn(
          i18n.t("Sorry, your account hasn't been verified yet or is blocked.")
        );
        return;
      }
    }

    await loader.show({
      message: i18n.t('Uploading your survey...'),
    });

    try {
      await sample.saveRemote();

      history.push(`${match.url}/report`);
    } catch (e) {
      // do nothing
    }

    loader.hide();
  };

  render() {
    const { appModel, match, sample } = this.props;
    if (!sample) {
      return null;
    }

    const isDisabled = sample.isUploaded();

    const uploadButton = (
      <IonButton
        onClick={this.onUpload}
        color="primary"
        fill="solid"
        shape="round"
      >
        Save
      </IonButton>
    );

    return (
      <Page id="survey-point-edit">
        <Header
          title="New Sighting"
          rightSlot={uploadButton}
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
