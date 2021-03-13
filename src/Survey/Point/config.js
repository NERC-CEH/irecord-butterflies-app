import * as Yup from 'yup';
import {
  dateAttr,
  locationAttrs,
  stageAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import { chatboxOutline } from 'ionicons/icons';
import icon from 'common/images/butterflyIcon.svg';

const survey = {
  id: 101,
  name: 'point',
  label: '', // we'll use species name
  icon,

  attrs: {
    appVersion: { id: 1139 },
    date: dateAttr,
    ...locationAttrs,
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

    create(Occurrence) {
      return new Occurrence({
        attrs: {
          count: 1,
          comment: null,
          stage: null,
          taxon: null,
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

  create(AppSample, AppOccurrence, options) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },

      attrs: {
        location: null,
      },
    });

    const occ = survey.occ.create(AppOccurrence);

    if (options.species) {
      occ.setSpecies(options.species);
    }

    sample.occurrences.push(occ);

    sample.startGPS();

    return sample;
  },

  verify(attrs) {
    try {
      const sampleSchema = Yup.object().shape({
        location: verifyLocationSchema,
      });

      sampleSchema.validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }

    return null;
  },
};

export default survey;
