import React from 'react';
import ReactDOM from 'react-dom';
import { setupConfig as ionicConfig, isPlatform } from '@ionic/react';
import appModel from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from 'common/config';
import { configure as mobxConfig } from 'mobx';
import { initAnalytics } from '@apps';
import App from './App';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import 'common/theme.scss';

const { App: AppPlugin, StatusBar, SplashScreen } = Plugins;

console.log('🚩 App starting.'); // eslint-disable-line

i18n.use(initReactI18next).init({ lng: 'en' });

ionicConfig({ hardwareBackButton: false, swipeBackEnabled: false });

mobxConfig({ enforceActions: 'never' });

async function init() {
  await appModel._init;
  await userModel._init;
  await savedSamples._init;

  initAnalytics({
    dsn: config.sentryDNS,
    environment: config.environment,
    build: config.build,
    release: config.version,
    userId: userModel.attrs.id,
    tags: {
      'app.appSession': appModel.attrs.appSession,
    },
  });

  appModel.attrs.appSession += 1;
  appModel.save();

  ReactDOM.render(<App />, document.getElementById('root'));

  if (isPlatform('hybrid')) {
    StatusBar.setStyle({
      style: StatusBarStyle.Light,
    });

    SplashScreen.hide();

    AppPlugin.addListener('backButton', () => {
      /* disable android app exit using back button */
    });
  }
}

init();
