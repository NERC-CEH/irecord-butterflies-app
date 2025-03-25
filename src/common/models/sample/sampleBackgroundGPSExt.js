/** ****************************************************************************
 * Indicia Sample geolocation functions.
 *
 * Sample geolocation events:
 * start, update, error, success, stop
 **************************************************************************** */
import { observable } from 'mobx';
import { updateModelLocation } from '@flumens';
import geojsonArea from '@mapbox/geojson-area';
import GPS from 'helpers/BackgroundGPS';

const METERS_SINCE_LAST_LOCATION = 15;

const DEFAULT_TRANSECT_BUFFER = 5; // 2.5x2 meters

function calculateLineLenght(lineString) {
  /**
   * Calculate the approximate distance between two coordinates (lat/lon)
   *
   * © Chris Veness, MIT-licensed,
   * http://www.movable-type.co.uk/scripts/latlong.html#equirectangular
   */
  function distance(λ1, φ1, λ2, φ2) {
    const R = 6371000;
    const Δλ = ((λ2 - λ1) * Math.PI) / 180;
    φ1 = (φ1 * Math.PI) / 180; //eslint-disable-line
    φ2 = (φ2 * Math.PI) / 180; //eslint-disable-line
    const x = Δλ * Math.cos((φ1 + φ2) / 2);
    const y = φ2 - φ1;
    const d = Math.sqrt(x * x + y * y);
    return R * d;
  }

  if (lineString.length < 2) return 0;
  let result = 0;
  for (let i = 1; i < lineString.length; i++)
    result += distance(
      lineString[i - 1][0],
      lineString[i - 1][1],
      lineString[i][0],
      lineString[i][1]
    );
  return result;
}

function getShape(sample) {
  const oldLocation = sample.data.location || {};

  if (!oldLocation.shape) {
    return { type: 'LineString', coordinates: [] };
  }
  return JSON.parse(JSON.stringify(oldLocation.shape));
}

function isSufficientDistanceMade(coordinates, latitude, longitude) {
  const lastLocation = [...(coordinates[coordinates.length - 1] || [])]
    .reverse()
    .map(parseFloat);
  const newLocation = [latitude, longitude].map(parseFloat);

  const distanceSinceLastLocation = calculateLineLenght([
    lastLocation,
    newLocation,
  ]);

  if (
    lastLocation.length &&
    distanceSinceLastLocation < METERS_SINCE_LAST_LOCATION
  ) {
    return false;
  }

  return true;
}

export function updateSampleArea(sample, location) {
  const { latitude, longitude, accuracy, altitude, altitudeAccuracy } =
    location;
  const shape = getShape(sample);
  const coordinates =
    shape.type === 'Polygon' ? shape.coordinates[0] : shape.coordinates;

  if (!isSufficientDistanceMade(coordinates, latitude, longitude)) {
    return sample;
  }

  coordinates.push([longitude, latitude]);
  return sample.setAreaLocation(shape, accuracy, altitude, altitudeAccuracy);
}

const extension = {
  backgroundGPSExtensionInit() {
    this.backgroundGPS = observable({ locating: null });
  },

  startBackgroundGPS() {
    console.log('SampleModel:Background GPS start');

    // eslint-disable-next-line
    const onPosition = (error, location) => {
      if (error) {
        console.error('Background GPS: error', error);

        this.stopBackgroundGPS();
        return;
      }

      const isPreciseAreaSubSample = !!this.parent;
      if (isPreciseAreaSubSample) {
        updateModelLocation(this, location);
        this.stopBackgroundGPS();
        return;
      }

      updateSampleArea(this, location);
    };

    this.backgroundGPS.locating = GPS.start(onPosition);
  },

  stopBackgroundGPS() {
    if (!this.isBackgroundGPSRunning()) {
      return;
    }

    console.log('SampleModel:Background GPS stop');
    GPS.stop(this.backgroundGPS.locating);
    this.backgroundGPS.locating = null;
  },

  isBackgroundGPSRunning() {
    return !!(this.backgroundGPS.locating || this.backgroundGPS.locating === 0);
  },

  toggleBackgroundGPS(state) {
    if (this.isBackgroundGPSRunning() || state === false) {
      this.stopBackgroundGPS();
      return;
    }

    this.startBackgroundGPS();
  },

  /**
   * Other helper functions.
   */

  setAreaLocation(shape, accuracy, altitude, altitudeAccuracy) {
    if (!shape) {
      this.data.location = null;
      return this.save();
    }

    let area;
    let [longitude, latitude] = shape.coordinates[0];

    if (shape.type === 'Polygon') {
      area = geojsonArea.geometry(shape);
      [longitude, latitude] = shape.coordinates[0][0]; // eslint-disable-line
    } else {
      area = DEFAULT_TRANSECT_BUFFER * calculateLineLenght(shape.coordinates);
    }

    area = Math.floor(area);

    this.data.location = {
      latitude,
      longitude,
      area,
      shape,
      source: 'map',
      accuracy,
      altitude,
      altitudeAccuracy,
    };

    return this.save();
  },
};

export default extension;
