import { Media, MediaAttrs } from '@flumens';
import { isPlatform } from '@ionic/react';
import { observable } from 'mobx';
import config from 'common/config';
import userModel from 'models/user';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import identifyImage from 'common/services/waarneming';

type Attrs = MediaAttrs & { species: any };

export default class AppMedia extends Media {
  attrs: Attrs = this.attrs;

  identification = observable({ identifying: false });

  constructor(options: any) {
    super(options);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });
  }

  async destroy(silent?: boolean) {
    // remove from internal storage
    if (!isPlatform('hybrid')) {
      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      if (silent) {
        return null;
      }

      return this.parent.save();
    }

    const URL = this.attrs.data;

    try {
      await Filesystem.deleteFile({
        path: URL,
        directory: Directory.Data,
      });

      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      if (silent) {
        return null;
      }

      return this.parent.save();
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  getURL() {
    const { data: name } = this.attrs;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }

  doesTaxonMatchParent() {
    const species = this.getTopSpecies();
    if (!species) return false;

    const speciesId = species.warehouse_id;
    const parentTaxon = this.parent.attrs?.taxon;

    return speciesId === parentTaxon?.warehouseId;
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }

  getTopSpecies() {
    if (!this.attrs.species) return null;

    return this.attrs.species[0];
  }

  async identify() {
    this.identification.identifying = true;

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.uploadFile();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const url = this.getRemoteURL();

      const suggestions = await identifyImage(url);

      this.attrs.species = suggestions;

      this.parent.save();
    } catch (error) {
      console.error(error);
    }

    this.identification.identifying = false;
    return null;
  }
}
