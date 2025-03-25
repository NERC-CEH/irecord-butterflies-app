import { observable } from 'mobx';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  Media as MediaOriginal,
  MediaAttrs,
  Sample,
  Occurrence,
} from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import identifyImage from 'common/services/waarneming';
import userModel from 'models/user';

type Attrs = MediaAttrs & { species: any };

export default class Media extends MediaOriginal<Attrs> {
  declare parent?: Sample | Occurrence;

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
      if (!this.parent) return;

      this.parent.media.remove(this);

      if (silent) return;

      this.parent.save();
      return;
    }

    const URL = this.data.data;

    try {
      await Filesystem.deleteFile({
        path: URL,
        directory: Directory.Data,
      });

      if (!this.parent) return;

      this.parent.media.remove(this);

      if (silent) return;

      this.parent.save();
    } catch (err) {
      console.error(err);
    }
  }

  getURL() {
    const { data: name } = this.data;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }

  getIdentifiedTaxonThatMatchParent() {
    if (!this.data.species) return null;

    const occurrenceWarehouseId = (this.parent as Occurrence).data?.taxon
      ?.warehouseId;
    const byWarehouseId = (sp: any) =>
      sp.warehouse_id === occurrenceWarehouseId;
    return this.data.species.find(byWarehouseId);
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }

  getTopSpecies() {
    if (!this.data.species) return null;

    return this.data.species[0];
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

      this.data.species = suggestions;

      if (!this.parent) return;
      this.parent.save();
    } catch (error) {
      this.identification.identifying = false;
      throw error;
    }

    this.identification.identifying = false;
  }
}
