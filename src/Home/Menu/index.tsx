import { FC } from 'react';
import { Page, device, useAlert, useLoader, useToast } from '@flumens';
import { observer } from 'mobx-react';
import { IonFooter } from '@ionic/react';
import userModel from 'models/user';
import appModel from 'models/app';
import flumensLogo from 'common/images/flumens.svg';
import config from 'common/config';
import Main from './Main';
import './styles.scss';

function showLogoutConfirmationDialog(callback: any, alert: any) {
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

const MenuController: FC = () => {
  const alert = useAlert();
  const loader = useLoader();
  const toast = useToast();

  function logOut() {
    const onReset = async (reset?: boolean) => {
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

  const checkActivation = async () => {
    await loader.show('Please wait...');
    try {
      await userModel.checkActivation();
      if (!userModel.attrs.verified) {
        toast.warn('The user has not been activated or is blocked.');
      }
    } catch (err: any) {
      toast.error(err);
    }
    loader.hide();
  };

  const resendVerificationEmail = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    await loader.show('Please wait...');
    try {
      await userModel.resendVerificationEmail();
      toast.success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.'
      );
    } catch (err: any) {
      toast.error(err);
    }
    loader.hide();
  };

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

export default observer(MenuController);
