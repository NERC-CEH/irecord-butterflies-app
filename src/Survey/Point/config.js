import * as Yup from 'yup';
import {
  dateAttr,
  locationAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import { chatboxOutline } from 'ionicons/icons';
import icon from 'common/images/butterflyIcon.svg';
import caterpillarIcon from 'common/images/caterpillar.svg';

const stageOptions = [
  { value: null, isDefault: true, label: 'Not Recorded' },
  { value: 'Adult', id: 3929 },
  { value: 'Larva', id: 3931 },
  { value: 'Egg', id: 3932 },
  { value: 'Pupae', id: 3930 },
  { value: 'Larval web', id: 14079 },
];

const survey = {
  id: 626,
  name: 'point',
  label: '', // we'll use species name
  icon,

  attrs: {
    date: dateAttr,
    location: locationAttr,
  },

  occ: {
    attrs: {
      taxon: {
        id: 'taxa_taxon_list_id',
        remote: { values: taxon => taxon.warehouse_id },
      },
      count: { id: 780 },
      stage: {
        id: 293,
        label: 'Stage',
        type: 'radio',
        info: 'Pick the life stage.',
        icon: caterpillarIcon,
        options: stageOptions,
        remote: { values: stageOptions },
      },
      comment: {
        label: 'Comment',
        id: 'comment',
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
          taxon: Yup.object().required(),
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
