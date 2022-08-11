import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import userModel from 'models/user';
import ThankYouAlert from 'common/Components/ThankYouAlert';
import WhatsNewDialog from 'common/Components/WhatsNewDialog';
import UpdatedRecordsAlert from 'common/Components/UpdatedRecordsAlert';
import Home from './Home';
import Settings from './Settings/router';
import Info from './Info/router';
import OnBoardingScreens from './Info/OnBoardingScreens';
import User from './User/router';
import Survey from './Survey/router';

const HomeRedirect = () => <Redirect to="home" />;

const App: FC = () => (
  <IonApp>
    <OnBoardingScreens appModel={appModel}>
      <WhatsNewDialog appModel={appModel} />
      <ThankYouAlert userModel={userModel} />

      <IonReactRouter>
        <UpdatedRecordsAlert appModel={appModel} savedSamples={savedSamples} />
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
