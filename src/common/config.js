import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { isPlatform } from '@ionic/react';

const backendUrl =
  process.env.APP_BACKEND_URL || 'https://www.brc.ac.uk/irecord';

const isTestEnv = process.env.NODE_ENV === 'test';

const config = {
  environment: process.env.NODE_ENV,
  version: process.env.APP_VERSION,
  build: process.env.APP_BUILD,

  log: !isTestEnv,

  sentryDNS: !isTestEnv && process.env.APP_SENTRY_KEY,

  map: {
    mapboxApiKey: process.env.APP_MAPBOX_MAP_KEY,
    mapboxSatelliteId: 'cehapps/cipqvo0c0000jcknge1z28ejp',
  },

  backend: {
    url: backendUrl,
    apiKey: process.env.APP_INDICIA_API_KEY,
  },
};

(async function getMediaDirectory() {
  if (isPlatform('hybrid')) {
    const { uri } = await Plugins.Filesystem.getUri({
      path: '',
      directory: FilesystemDirectory.Data,
    });
    config.dataPath = uri;
  }
})();

export default config;
