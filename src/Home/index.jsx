import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import savedSamples from 'models/savedSamples';
import userModel from 'models/user';
import appModel from 'models/app';
import { observer } from 'mobx-react';
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonRouterOutlet,
  NavContext,
} from '@ionic/react';
import {
  bookOutline,
  layersOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { alert } from '@apps';
import LongPressFabButton from 'common/Components/LongPressFabButton';
import PendingSurveysBadge from 'common/Components/PendingSurveysBadge';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import menuOutline from 'common/images/menuIcon.svg';
import { Trans as T } from 'react-i18next';
import Menu from './Menu';
import Species from './Species';
import About from './About';
import Surveys from './UserSurveys';
import './styles.scss';

const UserSurveys = () => <Surveys savedSamples={savedSamples} />;

const showLongPressAlert = () =>
  alert({
    header: 'Tip: Adding Observations',
    message: (
      <>
        Tap on the{' '}
        <IonIcon icon={butterflyIcon} className="long-tap-tip-message-icon" />{' '}
        button to capture a new record. <br />
        <br />
        Long-press{' '}
        <IonIcon
          icon={butterflyIcon}
          className="long-tap-tip-message-icon"
        />{' '}
        button to see some more advanced options.
      </>
    ),
    buttons: [
      {
        text: 'OK, got it',
        role: 'cancel',
        cssClass: 'primary',
      },
    ],
  });

class HomeComponent extends React.Component {
  static contextType = NavContext;

  showLongPressAlert = () => {
    if (!appModel.attrs.showLongPressTip) {
      return;
    }

    showLongPressAlert();
    appModel.attrs.showLongPressTip = false;
    appModel.save();
  };

  componentDidMount = async () => {
    this.showLongPressAlert();
  };

  navigateToPrimarySurvey = () => {
    this.context.navigate(`/survey/point`);
  };

  navigateToSecondarySurvey = () => {
    this.context.navigate(`/survey/list`);
  };

  render() {
    const MenuWrap = () => (
      <Menu
        userModel={userModel}
        appModel={appModel}
        savedSamples={savedSamples}
      />
    );

    return (
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/home" to="/home/species" />
          <Route path="/home/species" component={Species} exact />
          <Route path="/home/surveys" component={UserSurveys} exact />
          <Route path="/home/about" component={About} exact />
          <Route path="/home/menu" render={MenuWrap} exact />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="/home/species" href="/home/species">
            <IonIcon icon={bookOutline} />
            <IonLabel>
              <T>Species</T>
            </IonLabel>
          </IonTabButton>

          <IonTabButton tab="/home/surveys" href="/home/surveys">
            <IonIcon icon={layersOutline} />
            <IonLabel>
              <T>My Surveys</T>
            </IonLabel>
            <PendingSurveysBadge savedSamples={savedSamples} />
          </IonTabButton>

          <IonTabButton>
            <LongPressFabButton
              onClick={this.navigateToPrimarySurvey}
              onLongClick={this.navigateToSecondarySurvey}
              icon={butterflyIcon}
              label="Record"
            />
          </IonTabButton>

          <IonTabButton tab="/home/about" href="/home/about">
            <IonIcon icon={informationCircleOutline} />
            <IonLabel>
              <T>About</T>
            </IonLabel>
          </IonTabButton>

          <IonTabButton tab="/home/menu" href="/home/menu">
            <IonIcon icon={menuOutline} />
            <IonLabel>
              <T>Menu</T>
            </IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );
  }
}

export default observer(HomeComponent);
