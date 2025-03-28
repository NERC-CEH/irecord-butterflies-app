import { observable } from 'mobx';
import { updateModelLocation } from '@flumens';
import GPS from 'helpers/GPS';

const DEFAULT_ACCURACY_LIMIT = 50; // meters

const extension = {
  // eslint-disable-next-line default-param-last
  setLocation([longitude, latitude], source = 'map', accuracy) {
    this.data.location = {
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const options = {
      accuracyLimit,

      // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  hasLoctionMissingAndIsnotLocating() {
    return (
      (!this.data.location || !this.data.location.latitude) &&
      !this.isGPSRunning()
    );
  },
};

export default extension;
