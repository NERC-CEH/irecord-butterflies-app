/* eslint-disable no-await-in-loop */
import { reaction } from 'mobx';
import axios from 'axios';
import { camelCase, mapKeys } from 'lodash';
import { ZodError } from 'zod';
import {
  device,
  LocationCollection as LocationCollectionBase,
  LocationCollectionOptions,
  byLocationType,
  LocationType,
  isAxiosNetworkError,
  HandledError,
} from '@flumens';
import config from 'common/config';
import userModel from 'models/user';
import Location, {
  dtoSchema,
  Data as RemoteLocationAttributes,
} from '../location';
import { locationsStore as store } from '../store';

export class LocationsCollection extends LocationCollectionBase<Location> {
  declare Model: typeof Location;

  constructor(options: LocationCollectionOptions<Location>) {
    super(options);

    const fetchFirstTime = () => {
      if (
        !this.data.length &&
        device.isOnline &&
        userModel.isLoggedIn() &&
        !this.isSynchronising
      ) {
        this.fetchRemote().catch();
      }
    };

    this.ready && this.ready.then(fetchFirstTime);

    const onLoginChange = async (newEmail: any) => {
      if (!newEmail) return;

      await this.ready;

      console.log(`📚 Collection: ${this.id} collection email has changed`);
      fetchFirstTime();
    };
    const getEmail = () => userModel.data.email;
    reaction(getEmail, onLoginChange);
  }

  async fetchRemote() {
    console.log(`📚 Collection: ${this.id} collection fetching`);
    this.remote.synchronising = true;

    const sites = await this.fetchRemoteByType(LocationType.GroupSite);

    this.remote.synchronising = false;

    const models = sites.map(doc =>
      Array.isArray(doc)
        ? this.Model.fromDTO(doc[0], { metadata: doc[1] }) // with metadata
        : this.Model.fromDTO(doc)
    );

    while (this.length) {
      const model = this.pop();
      if (!model) continue; // eslint-disable-line no-continue
      await model.destroy();
    }

    await Promise.all(models.map(m => m.save()));

    this.push(...models);

    console.log(`📚 Collection: ${this.id} collection fetching done`);
  }

  private async fetchRemoteByType(
    locationTypeId: number | string
  ): Promise<RemoteLocationAttributes[]> {
    const url = `${this.remote.url}/index.php/services/rest/locations`;

    const token = await userModel.getAccessToken();

    const options = {
      params: {
        location_type_id: locationTypeId,
        public: false,
        verbose: 1,
      },
      headers: { Authorization: `Bearer ${token}` },
      timeout: 80000,
    };

    try {
      const res = await axios.get(url, options);

      const getValues = (doc: any) =>
        mapKeys(doc.values, (_, key) =>
          key.includes(':') ? key : camelCase(key)
        );
      const docs = res.data.map(getValues);

      docs.forEach(dtoSchema.parse);

      return docs;
    } catch (error: any) {
      if (axios.isCancel(error)) return [];

      if (isAxiosNetworkError(error))
        throw new HandledError(
          'Request aborted because of a network issue (timeout or similar).'
        );

      if ('issues' in error) {
        const err: ZodError = error;
        throw new Error(
          err.issues.map(e => `${e.path.join(' ')} ${e.message}`).join(' ')
        );
      }

      throw error;
    }
  }
}

const collection = new LocationsCollection({
  store,
  Model: Location,
  url: config.backend.indicia.url,
  getAccessToken: () => userModel.getAccessToken(),
});

export const byType = byLocationType;

export default collection;
