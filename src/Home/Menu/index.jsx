import React from 'react';
import { Page, alert } from '@apps';
import exact from 'prop-types-exact';
import PropTypes from 'prop-types';
import { IonFooter, IonItem, IonCheckbox, IonLabel } from '@ionic/react';
import flumensLogo from 'common/images/flumens.svg';
import config from 'common/config';
import Main from './Main';
import './styles.scss';

function showLogoutConfirmationDialog(callback) {
  let deleteData = true;

  const onCheckboxChange = e => {
    deleteData = e.detail.checked;
  };

  alert({
    header: 'Logout',
    message: (
      <>
        Are you sure you want to logout?
        <br />
        <br />
        <IonItem lines="none" className="log-out-checkbox">
          <IonLabel>Discard local data</IonLabel>
          <IonCheckbox checked onIonChange={onCheckboxChange} />
        </IonItem>
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
        handler: () => callback(deleteData),
      },
    ],
  });
}

const MenuController = ({ userModel, appModel, savedSamples }) => {
  function logOut() {
    const onReset = async reset => {
      if (reset) {
        // appModel.attrs['draftId:area'] = null; // TODO:
        await savedSamples.resetDefaults();
      }

      appModel.save();
      userModel.logOut();
    };

    showLogoutConfirmationDialog(onReset);
  }

  const isLoggedIn = !!userModel.attrs.id;

  return (
    <Page id="menu">
      <Main user={userModel.attrs} isLoggedIn={isLoggedIn} logOut={logOut} />
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
  savedSamples: PropTypes.array.isRequired,
});

export default MenuController;
