/* eslint-disable no-param-reassign, default-param-last, @getify/proper-arrows/name, @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import GPS from 'mock-geolocation';
import savedRecords from 'models/savedSamples';
import Sample from 'models/sample';
import Image from 'models/image';
import Occurrence from 'models/occurrence';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import track from 'json-loader!./track.geojson'; // eslint-disable-line
import defaultSurvey from 'Survey/Point/config';

window.FilesystemDirectory = FilesystemDirectory;

const testing = {};

testing.files = {
  ls: async (path = '', directory = FilesystemDirectory.Data) => {
    const { files } = await Plugins.Filesystem.readdir({
      path,
      directory,
    });

    const filesWithInfo = [];
    const filesWithInfoWrap = async file => {
      const stats = await Plugins.Filesystem.stat({
        path: file,
        directory,
      });

      filesWithInfo.push(stats);
    };
    files.forEach(filesWithInfoWrap);

    return filesWithInfo;
  },

  cp: async (path = '', directory = FilesystemDirectory.Data) => {
    await Plugins.Filesystem.copy({
      from: path,
      to: path.split('/').pop(),
      toDirectory: directory,
    });

    return Plugins.Filesystem.stat({
      path: path.split('/').pop(),
      directory,
    });
  },

  rm: async (path = '', directory = FilesystemDirectory.Data) => {
    await Plugins.Filesystem.deleteFile({
      path,
      directory,
    });
  },
};

testing.GPS = {
  mock: GPS.use,

  /**
   * GPS.update({ latitude: 1, longitude: -1, accuracy: 12 })
   *
   * @param options
   * @returns {*}
   */
  update(location) {
    GPS.change(location);
  },

  async simulate() {
    console.log('⌖ GPS track simulation start');

    this.mock();

    const onlyLines = feat => feat.geometry.type === 'LineString';
    const lines = track.features.filter(onlyLines);

    for (let lineId = 0; lineId < lines.length; lineId++) {
      const coords = lines[lineId].geometry.coordinates;
      for (let i = 0; i < coords.length; i++) {
        const [longitude, latitude] = coords[i];

        this.update({ latitude, longitude, accuracy: 1 });
        await new Promise(r => setTimeout(r, 1000)); //eslint-disable-line
      }
    }

    console.log('⌖ GPS track simulation complete');
  },

  stop() {
    if (this.interval || this.interval === 0) {
      clearInterval(this.interval);
    }
  },
};

testing.records = {
  /**
   * Reset All Records Status
   */
  resetRecordsStatus() {
    savedRecords.getAll((getError, recordsCollection) => {
      recordsCollection.forEach(record => {
        record.metadata.saved = false;
        record.metadata.server_on = null;
        record.metadata.synced_on = null;
        record.metadata.updated_on = null;
        record.save();
      });
    });
  },

  /**
   * Add a Dummy Record.
   */
  async addDummyRecord(count = 1, imageData, testID) {
    const allWait = [];

    for (let i = 0; i < count; i++) {
      console.log(`Adding ${i + 1}`);

      // eslint-disable-next-line no-await-in-loop
      await this._addDummyRecord(1, imageData, testID);
    }

    return allWait;
  },

  async _addDummyRecord(count, imageData, testID) {
    const image = await testing.records.generateImage(imageData, testID);

    const sampleTestID = `test ${testID} - ${count}`;

    const sample = await defaultSurvey.create(Sample, Occurrence, {
      species: 'DingySkipper',
    });

    const randDate = new Date();
    randDate.setDate(Math.floor(Math.random() * 31));

    sample.attrs.date = randDate;
    sample.attrs.location = {
      accuracy: 1,
      gridref: 'TQ12',
      latitude: 51.142,
      longitude: -0.50593,
      name: `${sampleTestID} location`,
      source: 'map',
    };

    sample.occurrences[0].attrs.comment = sampleTestID;
    if (image) sample.occurrences[0].media.push(image);

    // // saved;
    // sample.metadata.synced_on = Date.now();
    // sample.metadata.saved = true;

    await sample.save();

    savedRecords.push(sample);
  },

  generateImage(imageData, testID) {
    if (!imageData) {
      // create random image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(1000, 1000); // px

      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = (Math.random() * 100).toFixed(0);
        imgData.data[i + 1] = (Math.random() * 100).toFixed(0);
        imgData.data[i + 2] = (Math.random() * 100).toFixed(0);
        imgData.data[i + 3] = 105;
      }
      ctx.putImageData(imgData, 0, 0);
      imageData = canvas.toDataURL('jpeg');
    }

    if (!testID) {
      testID = (Math.random() * 10).toFixed(0);
    }

    const image = new Image({
      attrs: {
        data: imageData,
        type: 'image/png',
      },
    });

    return image.addThumbnail().then(() => image);
  },
};

window.testing = testing;
