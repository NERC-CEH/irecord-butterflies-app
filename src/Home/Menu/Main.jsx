import React from 'react';
import { Main } from '@apps';
import exact from 'prop-types-exact';
import PropTypes from 'prop-types';
import { IonIcon, IonList, IonItem, IonItemDivider } from '@ionic/react';
import {
  settingsOutline,
  personAddOutline,
  personOutline,
  exitOutline,
  heartOutline,
} from 'ionicons/icons';
import binocularsLogo from './binoculars.svg';

const MenuMain = ({ isLoggedIn, user, logOut }) => {
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
              {user.firstname} {user.secondname}
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
          <IonItem routerLink="/info/credits" detail>
            <IonIcon icon={heartOutline} size="small" slot="start" />
            Credits
          </IonItem>{' '}
          <IonItem routerLink="/info/where-to-look" detail>
            <IonIcon icon={binocularsLogo} size="small" slot="start" />
            Where to Look
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
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
});

export default MenuMain;
