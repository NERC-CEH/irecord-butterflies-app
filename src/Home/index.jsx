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
  IonFabList,
  IonFabButton,
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
        button to record a single species or sighting. <br />
        <br />
        Long-press{' '}
        <IonIcon
          icon={butterflyIcon}
          className="long-tap-tip-message-icon"
        />{' '}
        button to start a multi-species survey list.
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

  render() {
    const MenuWrap = () => (
      <Menu
        userModel={userModel}
        appModel={appModel}
        savedSamples={savedSamples}
      />
    );

    const { useExperiments } = appModel.attrs;

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
              <T>My Records</T>
            </IonLabel>
            <PendingSurveysBadge savedSamples={savedSamples} />
          </IonTabButton>

          <IonTabButton>
            <LongPressFabButton
              onClick={this.navigateToPrimarySurvey}
              icon={butterflyIcon}
              label="Record"
            >
              <IonFabList side="top">
                {useExperiments && (
                  <IonFabButton
                    class="fab-button-label"
                    routerLink="/survey/single-species-count"
                  >
                    <IonLabel>
                      <T>Single species timed count</T>
                    </IonLabel>
                  </IonFabButton>
                )}

                <IonFabButton
                  class="fab-button-label"
                  routerLink="/survey/list"
                >
                  <IonLabel>
                    <T>Species list</T>
                  </IonLabel>
                </IonFabButton>
                <div className="long-press-surveys-label">
                  <T>Click on other recording options from list below</T>
                </div>
              </IonFabList>
            </LongPressFabButton>
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
