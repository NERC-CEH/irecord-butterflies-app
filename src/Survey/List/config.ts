import { chatboxOutline, expandOutline } from 'ionicons/icons';
import { z, object } from 'zod';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import {
  dateAttr,
  locationAttrs,
  deviceAttr,
  appVersionAttr,
  stageAttr,
  Survey,
} from 'Survey/common/config';

const areaOptions = [
  {
    id: 3068,
    value: 'Point location',
  },
  {
    id: 3069,
    value: '100m x 100m',
  },
  {
    id: 3070,
    value: '1km x 1km',
  },
];

const survey: Survey = {
  id: 792,
  name: 'list',

  attrs: {
    date: dateAttr,
    ...locationAttrs,
    device: deviceAttr,
    appVersion: appVersionAttr,

    area: {
      menuProps: {
        required: true,
        icon: expandOutline,
        label: 'Area size',
      },
      pageProps: {
        attrProps: {
          input: 'radio',
          info: 'Please select the approximate size of your survey area.',
          inputProps: { options: areaOptions },
        },
      },
      remote: { id: 323, values: areaOptions },
    },
  },

  occ: {
    attrs: {
      taxon: {
        remote: {
          id: 'taxa_taxon_list_id',
          values: (taxon: any) => taxon.warehouseId,
        },
      },
      count: { remote: { id: 16 } },
      stage: stageAttr,
      comment: {
        menuProps: { icon: chatboxOutline },
        pageProps: {
          attrProps: {
            input: 'textarea',
            info: 'Add any extra information about your survey.',
          },
        },
      },
    },

    create({ Occurrence, taxon }) {
      return new Occurrence({
        data: {
          count: 1,
          comment: null,
          stage: 'Adult',
          taxon,
        },
      });
    },

    verify: (attrs: any) =>
      object({
        taxon: object({}, { required_error: 'Species is missing.' }).nullable(),
      }).safeParse(attrs).error,
  },

  async create({ Sample }) {
    const sample = new Sample({
      data: {
        surveyId: survey.id,
        date: new Date().toISOString(),
        enteredSrefSystem: 4326,
        location: null,
        device: isPlatform('android') ? 'android' : 'ios',
        appVersion: config.version,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify: (attrs: any) =>
    object({
      location: object(
        { latitude: z.number(), longitude: z.number(), name: z.string() },
        { invalid_type_error: 'Please select location.' }
      ),
      area: z
        .string({
          required_error: 'Please enter surveyed area size.',
        })
        .nullable(),
    }).safeParse(attrs).error,
};

export default survey;
