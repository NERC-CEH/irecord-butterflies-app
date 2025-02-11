import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import {
  TailwindBlockContext,
  TailwindContext,
  TailwindContextValue,
  defaultContext,
} from '@flumens';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ThankYouAlert from 'common/Components/ThankYouAlert';
import UpdatedRecordsAlert from 'common/Components/UpdatedRecordsAlert';
import WhatsNewDialog from 'common/Components/WhatsNewDialog';
import 'common/theme.scss';
import Home from './Home';
import OnboardingScreens from './Info/OnBoardingScreens';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const platform = isPlatform('ios') ? 'ios' : 'android';
const tailwindContext: TailwindContextValue = { platform };
const tailwindBlockContext = {
  ...defaultContext,
  ...tailwindContext,
  basePath: '',
};

const HomeRedirect = () => <Redirect to="home" />;

const App = () => (
  <IonApp>
    <OnboardingScreens>
      <WhatsNewDialog />
      <ThankYouAlert />
      <TailwindContext.Provider value={tailwindContext}>
        <TailwindBlockContext.Provider value={tailwindBlockContext}>
          <IonReactRouter>
            <UpdatedRecordsAlert />
            <IonRouterOutlet id="main">
              <Route exact path="/" component={HomeRedirect} />
              <Route path="/home" component={Home} />
              {User}
              {Info}
              {Survey}
              {Settings}
            </IonRouterOutlet>
          </IonReactRouter>
        </TailwindBlockContext.Provider>
      </TailwindContext.Provider>
    </OnboardingScreens>
  </IonApp>
);

export default observer(App);
