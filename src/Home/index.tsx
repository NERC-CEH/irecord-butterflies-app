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
import { useAlert } from '@flumens';
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
import butterflyIcon from 'common/images/butterflyIcon.svg';
import menuOutline from 'common/images/menuIcon.svg';
import appModel from 'models/app';
import savedSamples from 'models/collections/samples';
import About from './About';
import Menu from './Menu';
import PendingSurveysBadge from './PendingSurveysBadge';
import Species from './Species';
import SurveyButton from './SurveyButton';
import Surveys from './UserSurveys';
import './styles.scss';

const UserSurveys = () => <Surveys savedSamples={savedSamples} />;

const useLongPressAlert = () => {
  const alert = useAlert();

  const longPressAlert = () =>
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

  return longPressAlert;
};

const HomeComponent = () => {
  const { navigate } = useContext(NavContext);
  const ionRouter = useIonRouter();
  const showLongPressAlert = useLongPressAlert();

  const showLongPressAlertOnInit = () => {
    if (!appModel.attrs.showLongPressTip) {
      return;
    }

    showLongPressAlert();
    appModel.attrs.showLongPressTip = false;
    appModel.save();
  };

  useEffect(showLongPressAlertOnInit, []);

  const navigateToPrimarySurvey = () => navigate(`/survey/point`);
  const navigateToListSurvey = () => navigate(`/survey/list`);
  const navigateToTimedSurvey = () => navigate(`/survey/single-species-count`);

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
        <Route path="/home/surveys/:id?" component={UserSurveys} exact />
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
