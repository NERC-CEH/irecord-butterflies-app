import { chatboxOutline } from 'ionicons/icons';
import { z, object } from 'zod';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import icon from 'common/images/butterflyIcon.svg';
import {
  dateAttr,
  locationAttrs,
  deviceAttr,
  appVersionAttr,
  stageAttr,
  Survey,
  areaSizeAttr,
} from 'Survey/common/config';

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

    /**
     * @deprecated we only use this for old list surveys that were assigned id=101
     */
    area: areaSizeAttr,
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

    create({ Occurrence }) {
      return new Occurrence({
        data: {
          count: 1,
          comment: null,
          stage: 'Adult',
          taxon: null,
        },
      });
    },

    verify: (attrs: any) =>
      object({
        taxon: object({}, { invalid_type_error: 'Species is missing.' }),
      }).safeParse(attrs).error,
  },

  async create({ Sample, Occurrence, speciesId }) {
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

    const occ = await survey.occ!.create!({ Occurrence: Occurrence! });

    if (speciesId) {
      occ?.setSpecies(speciesId);
    }

    sample.occurrences.push(occ);

    sample.startGPS();

    return sample;
  },

  verify: (attrs: any) =>
    object({
      location: object(
        {
          latitude: z.number(),
          longitude: z.number(),
          name: z.string({ required_error: 'Location name missing' }),
        },
        { invalid_type_error: 'Please select location.' }
      ),
    }).safeParse(attrs).error,
};

export default survey;
