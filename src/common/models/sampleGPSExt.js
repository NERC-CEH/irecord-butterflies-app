import GPS from 'helpers/GPS';
import { observable } from 'mobx';
import { updateModelLocation } from '@apps';

const DEFAULT_ACCURACY_LIMIT = 50; // meters

const extension = {
  setLocation([longitude, latitude], source = 'map', accuracy) {
    this.attrs.location = {
      latitude,
      longitude,
      source,
      accuracy,
    };

    return this.save();
  },

  toggleGPStracking(state) {
    if (this.isGPSRunning() || state === false) {
      this.stopGPS();
      return;
    }

    this.startGPS();
  },

  gpsExtensionInit() {
    this.gps = observable({ locating: null });
  },

  async startGPS(accuracyLimit = DEFAULT_ACCURACY_LIMIT) {
    const that = this;
    const options = {
      accuracyLimit,

      onUpdate() {},

      callback(error, location) {
        if (error) {
          that.stopGPS();
          return;
        }
        if (location.accuracy <= options.accuracyLimit) {
          that.stopGPS();
        }

        updateModelLocation(that, location);
      },
    };

    this.gps.locating = await GPS.start(options);
  },

  stopGPS() {
    if (!this.gps.locating) {
      return;
    }

    GPS.stop(this.gps.locating);
    this.gps.locating = null;
  },

  isGPSRunning() {
    return !!(this.gps.locating || this.gps.locating === 0);
  },
};

export { extension as default };
