import * as Yup from 'yup';
import {
  dateAttr,
  locationAttrs,
  stageAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import { chatboxOutline, expandOutline } from 'ionicons/icons';
import icon from 'common/images/butterflyIcon.svg';

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
  id: 101,
  name: 'list',
  label: 'List', // we'll use species name
  icon,

  attrs: {
    appVersion: { id: 1139 },
    date: dateAttr,
    ...locationAttrs,

    area: {
      icon: expandOutline,
      label: 'Area size',
      info: 'Please select the approximate size of your survey area.',
      type: 'radio',
      required: true,
      componentProps: {
        options: areaOptions,
      },
      remote: {
        id: 323,
        values: areaOptions,
      },
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
        label: 'Comment',
        icon: chatboxOutline,
        type: 'textarea',
        info: 'Add any extra information about your survey.',
      },
    },

    create(Occurrence, taxon) {
      return new Occurrence({
        attrs: {
          count: 1,
          comment: null,
          stage: null,
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
