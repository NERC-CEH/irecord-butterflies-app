import * as Yup from 'yup';
import {
  dateAttr,
  locationAttrs,
  deviceAttr,
  appVersionAttr,
  stageAttr,
  verifyLocationSchema,
} from 'Survey/common/config';
import { Survey } from 'common/surveys';

import { isPlatform } from '@ionic/react';
import { chatboxOutline } from 'ionicons/icons';
import icon from 'common/images/butterflyIcon.svg';
import config from 'common/config';

const survey: Survey = {
  id: 101,
  name: 'point',
  label: '', // we'll use species name
  icon,

  attrs: {
    date: dateAttr,
    ...locationAttrs,
    device: deviceAttr,
    appVersion: appVersionAttr,
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

    create(Occurrence) {
      return new Occurrence({
        attrs: {
          count: 1,
          comment: null,
          stage: 'Adult',
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
        device: isPlatform('android') ? 'android' : 'ios',
        appVersion: config.version,
      },
    });

    const occ = survey?.occ?.create(AppOccurrence);

    if (options.species) {
      occ?.setSpecies(options.species);
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
