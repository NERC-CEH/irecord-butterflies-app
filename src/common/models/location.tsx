import { IObservableArray, observable } from 'mobx';
import { snakeCase } from 'lodash';
import {
  LocationModel,
  LocationData,
  LocationOptions,
  ModelAttrs,
  UUIDv7,
} from '@flumens';
import config from 'common/config';
import userModel from 'models/user';
import Media from './image';
import { locationsStore } from './store';

export { locationDtoSchema as dtoSchema, LocationType } from '@flumens';

export type Data = LocationData & ModelAttrs;

class Location extends LocationModel<Data> {
  static fromDTO(
    { id, createdOn, updatedOn, externalKey, ...data }: any,
    options?: LocationOptions
  ) {
    const parsedRemoteJSON: any = {
      cid: externalKey || UUIDv7(),
      id,
      createdAt: new Date(createdOn!).getTime(),
      updatedAt: new Date(updatedOn!).getTime(),
      data: {
        id,
        createdAt: createdOn,
        ...data,
      },
      ...options,
    };

    return new this(parsedRemoteJSON);
  }

  media: IObservableArray<Media>;

  constructor({
    skipStore,
    media = [],
    metadata = {},
    ...options
  }: LocationOptions) {
    super({
      store: skipStore ? undefined : locationsStore,
      url: config.backend.indicia.url,
      getAccessToken: () => userModel.getAccessToken(),
      ...options,
    });

    this.metadata = observable(metadata);

    this.media = observable(media);
  }

  toDTO(warehouseMediaNames = {}) {
    const toSnakeCase = (attrs: any) =>
      Object.entries(attrs).reduce((agg: any, [attr, value]): any => {
        const attrModified = attr.includes('locAttr:') ? attr : snakeCase(attr);
        agg[attrModified] = value; // eslint-disable-line no-param-reassign
        return agg;
      }, {});

    const data = toSnakeCase(this.data);

    const submission: any = {
      values: {
        external_key: this.cid,
        ...data,
      },
      media: [],
    };

    this.media.forEach(model => {
      const modelSubmission = model.toDTO(warehouseMediaNames);
      if (!modelSubmission) return;

      submission.media.push(modelSubmission);
    });

    return submission;
  }
}

export default Location;
