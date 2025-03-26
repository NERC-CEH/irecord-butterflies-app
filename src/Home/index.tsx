import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  bookOutline,
  layersOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Route, Redirect } from 'react-router-dom';
import { App as AppPlugin } from '@capacitor/app';
import { useAlert } from '@flumens/ionic/dist/hooks';
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonRouterOutlet,
  NavContext,
  useIonRouter,
} from '@ionic/react';
import menuOutline from 'common/images/menuIcon.svg';
import About from './About';
import Menu from './Menu';
import PendingSurveysBadge from './PendingSurveysBadge';
import Species from './Species';
import SurveyButton from './SurveyButton';
import Surveys from './UserSurveys';
import './styles.scss';

const HomeComponent = () => {
  const { navigate } = useContext(NavContext);
  const ionRouter = useIonRouter();
  const alert = useAlert();

  const navigateToPrimarySurvey = () => navigate(`/survey/point`);
  const navigateToListSurvey = () => navigate(`/survey/list`);
  const navigateToTimedSurvey = () => {
    alert({
      header: 'Single or multiple species',
      message: 'Are you recording a single species or multiple?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Single',
          handler: () => navigate(`/survey/single-species-count`),
        },
        {
          text: 'Multiple',
          handler: () => navigate(`/survey/multi-species-count`),
        },
      ],
    });
  };

  const exitApp = () => {
    const onExitApp = () => !ionRouter.canGoBack() && AppPlugin.exitApp();

    // eslint-disable-next-line @getify/proper-arrows/name
    document.addEventListener('ionBackButton', (ev: any) =>
      ev.detail.register(-1, onExitApp)
    );

    const removeEventListener = () =>
      document.addEventListener('ionBackButton', onExitApp);
    return removeEventListener;
  };
  useEffect(exitApp, []);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/home" to="/home/species" />
        <Route path="/home/species" component={Species} exact />
        <Route path="/home/surveys/:id?" component={Surveys} exact />
        <Route path="/home/about" component={About} exact />
        <Route path="/home/menu" component={Menu} exact />
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
          <PendingSurveysBadge />
        </IonTabButton>

        <IonTabButton>
          <SurveyButton
            onPrimarySurvey={navigateToPrimarySurvey}
            onListSurvey={navigateToListSurvey}
            onTimedSurvey={navigateToTimedSurvey}
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
};

export default observer(HomeComponent);
