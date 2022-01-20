import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import appModel from 'models/app';
import userModel from 'models/user';
import ThankYouAlert from 'common/Components/ThankYouAlert';
import Home from './Home';
import Settings from './Settings/router';
import Info from './Info/router';
import OnBoardingScreens from './Info/OnBoardingScreens';
import User from './User/router';
import Survey from './Survey/router';

const HomeRedirect = () => {
  return <Redirect to="home" />;
};

const App = () => (
  <IonApp>
    <OnBoardingScreens appModel={appModel}>
      <ThankYouAlert userModel={userModel} />
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route exact path="/" component={HomeRedirect} />
          <Route path="/home" component={Home} />
          {User}
          {Info}
          {Settings}
          {Survey}
        </IonRouterOutlet>
      </IonReactRouter>
    </OnBoardingScreens>
  </IonApp>
);

export default observer(App);
