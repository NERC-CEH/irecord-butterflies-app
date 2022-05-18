import { InfoMessage, Main } from '@apps';
import exact from 'prop-types-exact';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  IonIcon,
  IonList,
  IonItem,
  IonItemDivider,
  IonButton,
} from '@ionic/react';
import {
  settingsOutline,
  personAddOutline,
  personOutline,
  statsChartOutline,
  exitOutline,
  heartOutline,
  informationCircleOutline,
} from 'ionicons/icons';

const MenuMain = ({
  isLoggedIn,
  userModel,
  logOut,
  refreshAccount,
  resendVerificationEmail,
}) => {
  const isNotVerified = userModel.attrs.verified === false; // verified is undefined in old versions
  const userEmail = userModel.attrs.email;

  return (
    <Main className="app-menu">
      <h1>Menu</h1>

      <IonList lines="full">
        <IonItemDivider>User</IonItemDivider>
        <div className="rounded">
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
              Looks like your <b>{{ userEmail }}</b> email hasn't been verified
              yet.
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

        <IonItemDivider>Info</IonItemDivider>
        <div className="rounded">
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

        <IonItemDivider>Settings</IonItemDivider>
        <div className="rounded">
          <IonItem routerLink="/settings/menu" detail>
            <IonIcon icon={settingsOutline} size="small" slot="start" />
            App
          </IonItem>
        </div>
      </IonList>
    </Main>
  );
};

MenuMain.propTypes = exact({
  logOut: PropTypes.func.isRequired,
  refreshAccount: PropTypes.func,
  resendVerificationEmail: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
  userModel: PropTypes.object.isRequired,
});

export default observer(MenuMain);
