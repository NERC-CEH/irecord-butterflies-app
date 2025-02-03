import { observe } from 'mobx';
import { device } from '@flumens';
import config from 'common/config';

// TODO get values from config

interface API_TYPES {
  main: { temp: string };
  wind: { speed: string; deg: string };
  clouds: { all: string };
}

interface WEATHER_TYPES {
  cloud: number | null;
  temperature: string | number | null;
  windDirection: string | null;
  windSpeed: string | null;
}

const url = config.weatherSiteUrl;

function getCelsiusTemperature(fahrenheitFromService: string) {
  const fahrenheit = parseFloat(fahrenheitFromService);

  if (Number.isNaN(fahrenheit)) {
    return null;
  }

  const temperature = Math.round(((fahrenheit - 32) * 5) / 9);

  if (temperature < 10) {
    return null;
  }

  if (temperature > 39) {
    return '40+';
  }

  return temperature;
}

const getWindDirection = (degreesFromService: string) => {
  const degrees = parseFloat(degreesFromService);

  if (Number.isNaN(degrees) || degrees > 360) {
    return null;
  }

  if (degrees < 45) {
    return 'N';
  }
  if (degrees < 45 * 2) {
    return 'NE';
  }
  if (degrees < 45 * 3) {
    return 'E';
  }
  if (degrees < 45 * 4) {
    return 'SE';
  }
  if (degrees < 45 * 5) {
    return 'S';
  }
  if (degrees < 45 * 6) {
    return 'SW';
  }
  if (degrees < 45 * 7) {
    return 'W';
  }

  return 'NW';
};

const getWindSpeed = (speedFromService: string) => {
  const speed = parseFloat(speedFromService);

  if (Number.isNaN(speed)) {
    return null;
  }

  if (speed < 1) {
    return 'Smoke rises vertically';
  }
  if (speed <= 3) {
    return 'Slight smoke drift';
  }
  if (speed <= 7) {
    return 'Wind felt on face, leaves rustle';
  }
  if (speed <= 12) {
    return 'Leaves and twigs in slight motion';
  }
  if (speed <= 18) {
    return 'Dust raised and small branches move';
  }
  if (speed <= 24) {
    return 'Small trees in leaf begin to sway';
  }

  return 'Large branches move and trees sway';
};

const getCloud = (cloudFromService: string) => {
  const cloud = parseFloat(cloudFromService);

  if (Number.isNaN(cloud)) {
    return null;
  }

  // invert clouds to sunshine
  return Math.round(cloud);
};

const fetchWeatherData = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const toResponseJson = (response: any) => response.json();
  return fetch(
    `${url}?lat=${latitude}&lon=${longitude}&units=Imperial&appid=${config.weatherSiteApiKey}`
  ).then(toResponseJson);
};

const normaliseResponseValues = ({ main, wind, clouds }: API_TYPES) => ({
  temperature: getCelsiusTemperature((main || {}).temp),
  windSpeed: getWindSpeed((wind || {}).speed),
  windDirection: getWindDirection((wind || {}).deg),
  cloud: getCloud((clouds || {}).all),
});

function setNewWeatherValues(sample: any, newWeatherValues: WEATHER_TYPES) {
  if (
    !Number.isFinite(sample.attrs.temperature) &&
    Number.isFinite(newWeatherValues.temperature)
  ) {
    sample.attrs.temperature = newWeatherValues.temperature; // eslint-disable-line
  }
  if (!sample.attrs.windDirection && newWeatherValues.windDirection) {
    sample.attrs.windDirection = newWeatherValues.windDirection; // eslint-disable-line
  }
  if (!sample.attrs.windSpeed && newWeatherValues.windSpeed) {
    sample.attrs.windSpeed = newWeatherValues.windSpeed; // eslint-disable-line
  }
  if (
    !Number.isFinite(sample.attrs.cloud) &&
    Number.isFinite(newWeatherValues.cloud)
  ) {
    sample.attrs.cloud = newWeatherValues.cloud; // eslint-disable-line
    sample.attrs.sun = 100 - sample.attrs.cloud; // eslint-disable-line
  }
  sample.save();
}

const extension: any = {
  startMetOfficePull(): any {
    // Log('SampleModel:MetOffice: start.');

    let stopLocationObserver: any;

    const observeLocation = async ({ newValue }: any) => {
      const sampleWasSetForSubmission = this.metadata.saved;

      if (
        !device.isOnline ||
        sampleWasSetForSubmission ||
        !newValue ||
        !newValue.longitude
      ) {
        return;
      }

      try {
        stopLocationObserver();

        const response = await fetchWeatherData(newValue);

        const weatherValues: WEATHER_TYPES = normaliseResponseValues(response);

        setNewWeatherValues(this, weatherValues);
      } catch (err) {
        console.error(err);
      }
    };

    stopLocationObserver = observe(this.attrs, 'location', observeLocation);
  },
};

export default extension;
