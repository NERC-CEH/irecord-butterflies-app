const backendUrl =
  process.env.APP_BACKEND_URL || 'https://www.brc.ac.uk/irecord';

const isTestEnv = process.env.NODE_ENV === 'test';

const CONFIG = {
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

export default CONFIG;
