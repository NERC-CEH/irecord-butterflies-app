import { Filesystem, Directory } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';

const backendUrl = process.env.APP_BACKEND_URL || 'https://irecord.org.uk';

const indiciaUrl =
  process.env.APP_BACKEND_INDICIA_URL || 'https://warehouse1.indicia.org.uk';

const config = {
  POSITIVE_THRESHOLD: 0.7,
  POSSIBLE_THRESHOLD: 0.2,

  environment: process.env.NODE_ENV as string,
  version: process.env.APP_VERSION as string,
  build: process.env.APP_BUILD as string,
  feedbackEmail: 'apps%40ceh.ac.uk',

  sentryDNS: process.env.APP_SENTRY_KEY as string,

  map: {
    mapboxApiKey: process.env.APP_MAPBOX_MAP_KEY as string,
  },

  backend: {
    url: backendUrl,
    websiteId: 118,
    clientId: process.env.APP_BACKEND_CLIENT_ID as string,
    clientPass: process.env.APP_BACKEND_CLIENT_PASS as string,

    recordsServiceURL: `${indiciaUrl}/index.php/services/rest/es-occurrences/_search`,

    mediaUrl: `${indiciaUrl}/upload/`,

    indicia: {
      url: indiciaUrl,
    },
  },

  weatherSiteApiKey: process.env.APP_WEATHER_SITE_API_KEY as string,
  weatherSiteUrl: 'https://api.openweathermap.org/data/2.5/weather',

  dataPath: '',
};

(async function getMediaDirectory() {
  if (isPlatform('hybrid')) {
    const { uri } = await Filesystem.getUri({
      path: '',
      directory: Directory.Data,
    });
    config.dataPath = uri;
  }
})();

export default config;
