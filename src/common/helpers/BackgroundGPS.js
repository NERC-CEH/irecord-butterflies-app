import i18n from 'i18next';
import { Modals, registerPlugin } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { isPlatform } from '@ionic/react';

export const GPS_DISABLED_ERROR_MESSAGE = 'Location services are not enabled';

const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

const API = {
  watchId: null,

  clientCallbackId: 0,

  clientCallbacks: {
    // _clientCallbackId: onPosition
  },

  _onWatchPosition(position, err) {
    const clientCallbacks = Object.values(API.clientCallbacks);

    if (err) {
      if (err.code === 'NOT_AUTHORIZED') {
        const openSettings = ({ value }) =>
          value && BackgroundGeolocation.openSettings();
        Modals.confirm({
          title: 'Location Required',
          message:
            'This app needs your location, but does not have permission. Open settings now?',
        }).then(openSettings);
      }

      console.error(err);

      clientCallbacks.forEach(callback => callback(err));
      return;
    }

    if (!isPlatform('hybrid')) {
      position = position.coords;
    }

    const accuracy = parseInt(position.accuracy, 10);
    const altitude = parseInt(position.altitude, 10);
    const altitudeAccuracy = parseInt(position.altitudeAccuracy, 10);

    if (accuracy > 50) return;

    const location = {
      latitude: parseFloat(position.latitude.toFixed(8)),
      longitude: parseFloat(position.longitude.toFixed(8)),
      accuracy,
      altitude,
      altitudeAccuracy,
    };

    clientCallbacks.forEach(callback => callback(null, location));
  },

  async _clearWatch() {
    if (!isPlatform('hybrid')) {
      Geolocation.clearWatch({ id: API.watchId });
      API.watchId = null;
      return;
    }

    const id = await API.watchId;
    BackgroundGeolocation.removeWatcher({
      id,
    });

    API.watchId = null;
  },

  async _startWatch() {
    if (!isPlatform('hybrid')) {
      API.watchId = Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        },
        API._onWatchPosition
      );
      return;
    }

    API.watchId = await BackgroundGeolocation.addWatcher(
      {
        backgroundTitle: i18n.t('Using your location.'),
        backgroundMessage: i18n.t('Cancel to prevent battery drain.'),
        requestPermissions: true,
        stale: false,
      },
      API._onWatchPosition
    );
  },

  start(onPosition) {
    if (typeof onPosition !== 'function') {
      throw new Error('GPS start callback is missing');
    }

    if (!API.watchId) {
      API._startWatch();
    }

    API.clientCallbackId++;

    API.clientCallbacks[API.clientCallbackId] = onPosition;

    return API.clientCallbackId;
  },

  stop(id) {
    if (!id) {
      throw new Error('GPS stop callback id is missing');
    }

    delete API.clientCallbacks[id];

    const clientCallbacks = Object.values(API.clientCallbacks);
    if (!clientCallbacks.length) {
      API._clearWatch();
    }
  },
};

export default API;
