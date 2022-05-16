import React from 'react';
import { Page, useAlert } from '@apps';
import { observer } from 'mobx-react';
import exact from 'prop-types-exact';
import PropTypes from 'prop-types';
import { IonFooter } from '@ionic/react';
import flumensLogo from 'common/images/flumens.svg';
import config from 'common/config';
import Main from './Main';
import './styles.scss';

function showLogoutConfirmationDialog(callback, alert) {
  alert({
    header: 'Logout',
    message: (
      <>
        Are you sure you want to logout?
        <br />
        <br />
        Your pending and uploaded <b>records will not be deleted </b> from this
        device.
      </>
    ),
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Logout',
        cssClass: 'primary',
        handler: () => callback(),
      },
    ],
  });
}

const MenuController = ({ userModel, appModel }) => {
  const alert = useAlert();

  function logOut() {
    const onReset = async reset => {
      if (reset) {
        // appModel.attrs['draftId:area'] = null; // TODO:
        // await savedSamples.resetDefaults();
      }

      appModel.save();
      userModel.logOut();
    };

    showLogoutConfirmationDialog(onReset, alert);
  }

  const isLoggedIn = userModel.isLoggedIn();

  const checkActivation = () => userModel.checkActivation();
  const resendVerificationEmail = () => userModel.resendVerificationEmail();

  return (
    <Page id="menu">
      <Main
        userModel={userModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
        refreshAccount={checkActivation}
        resendVerificationEmail={resendVerificationEmail}
      />
      <IonFooter className="ion-no-border">
        <div>
          <a href="https://flumens.io">
            <img src={flumensLogo} alt="logo" />
          </a>

          <p className="app-version">{`App version: v${config.version} (${config.build})`}</p>
        </div>
      </IonFooter>
    </Page>
  );
};

MenuController.propTypes = exact({
  userModel: PropTypes.object.isRequired,
  appModel: PropTypes.object.isRequired,
});

export default observer(MenuController);
