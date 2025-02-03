import { observer } from 'mobx-react';
import {
  settingsOutline,
  personAddOutline,
  personOutline,
  statsChartOutline,
  exitOutline,
  heartOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { InfoMessage, Main } from '@flumens';
import { IonIcon, IonList, IonItem, IonButton } from '@ionic/react';
import config from 'common/config';
import flumensLogo from 'common/images/flumens.svg';

type Props = {
  logOut: any;
  refreshAccount: any;
  resendVerificationEmail: any;
  isLoggedIn: any;
  userModel: any;
};

const MenuMain = ({
  isLoggedIn,
  userModel,
  logOut,
  refreshAccount,
  resendVerificationEmail,
}: Props) => {
  const isNotVerified = userModel.attrs.verified === false; // verified is undefined in old versions
  const userEmail = userModel.attrs.email;

  return (
    <Main className="app-menu">
      <h1>Menu</h1>

      <IonList lines="full">
        <h3 className="list-title">
          <T>User</T>
        </h3>
        <div className="rounded-list">
          {isLoggedIn && (
            <IonItem detail id="logout-button" onClick={logOut}>
              <IonIcon icon={exitOutline} size="small" slot="start" />
              Logout
              {': '}
              {userModel.attrs.firstName} {userModel.attrs.secondName}
            </IonItem>
          )}

          {isLoggedIn && isNotVerified && (
            <InfoMessage className="verification-warning">
              Looks like your <b>{{ userEmail } as any}</b> email hasn't been
              verified yet.
              <div>
                <IonButton fill="outline" onClick={refreshAccount}>
                  Refresh
                </IonButton>
                <IonButton fill="clear" onClick={resendVerificationEmail}>
                  Resend Email
                </IonButton>
              </div>
            </InfoMessage>
          )}

          {isLoggedIn && (
            <IonItem routerLink="/user/statistics" detail>
              <IonIcon icon={statsChartOutline} size="small" slot="start" />
              Statistics
            </IonItem>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/login" detail>
              <IonIcon icon={personOutline} size="small" slot="start" />
              Login
            </IonItem>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/register" detail>
              <IonIcon icon={personAddOutline} size="small" slot="start" />
              Register
            </IonItem>
          )}
        </div>

        <h3 className="list-title">
          <T>Info</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/info/faq" detail>
            <IonIcon
              icon={informationCircleOutline}
              size="small"
              slot="start"
            />
            Frequently Asked Questions
          </IonItem>
          <IonItem routerLink="/info/credits" detail>
            <IonIcon icon={heartOutline} size="small" slot="start" />
            Credits
          </IonItem>
        </div>

        <h3 className="list-title">
          <T>Settings</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/settings/menu" detail>
            <IonIcon icon={settingsOutline} size="small" slot="start" />
            App
          </IonItem>
        </div>
      </IonList>

      <div className="mt-12">
        <a href="https://flumens.io">
          <img src={flumensLogo} alt="logo" className="mx-auto max-w-36" />
        </a>

        <p className="text-center opacity-80">{`App version: v${config.version} (${config.build})`}</p>
      </div>
    </Main>
  );
};

export default observer(MenuMain);
