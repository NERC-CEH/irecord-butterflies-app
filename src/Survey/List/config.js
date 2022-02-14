import * as Yup from 'yup';
import {
  dateAttr,
  locationAttrs,
  deviceAttr,
  appVersionAttr,
  stageAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import { isPlatform } from '@ionic/react';
import { chatboxOutline, expandOutline } from 'ionicons/icons';
import icon from 'common/images/butterflyIcon.svg';
import config from 'common/config';

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

const survey = {
  id: 101, // same as the point
  name: 'list',
  label: 'List', // we'll use species name
  icon,

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
          values: taxon => taxon.warehouseId,
        },
      },
      count: { id: 16 },
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

    create(Occurrence, taxon) {
      return new Occurrence({
        attrs: {
          count: 1,
          comment: null,
          stage: 'Adult',
          taxon,
        },
      });
    },

    verify(attrs) {
      try {
        const occurrenceScheme = Yup.object().shape({
          taxon: Yup.object().nullable().required('Species is missing.'),
        });

        occurrenceScheme.validateSync(attrs, { abortEarly: false });
      } catch (attrError) {
        return attrError;
      }

      return null;
    },
  },

  create(AppSample) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        location: null,
        area: null,
        device: isPlatform('android') ? 'android' : 'ios',
        appVersion: config.version,
      },
    });

    sample.startGPS();

    return sample;
  },

  verify(attrs) {
    try {
      const sampleSchema = Yup.object().shape({
        location: verifyLocationSchema,
        area: Yup.string()
          .nullable()
          .required('Please enter surveyed area size.'),
      });

      sampleSchema.validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
