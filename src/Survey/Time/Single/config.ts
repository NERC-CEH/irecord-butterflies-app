// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { toJS } from 'mobx';
import { chatboxOutline, business } from 'ionicons/icons';
import wkt from 'wellknown';
import { z, object } from 'zod';
import { SphericalMercator } from '@mapbox/sphericalmercator';
import { dateFormat } from 'common/flumens';
import caterpillarIcon from 'common/images/caterpillar.svg';
import {
  stageAttr,
  deviceAttr,
  appVersionAttr,
  stageOptions,
  Survey,
} from 'Survey/common/config';

const merc = new SphericalMercator();

const MINUTE = 60000; // in milliseconds

const temperatureValues = [
  { value: 10, id: 16530 },
  { value: 11, id: 16531 },
  { value: 12, id: 16532 },
  { value: 13, id: 16533 },
  { value: 14, id: 16534 },
  { value: 15, id: 16535 },
  { value: 16, id: 16536 },
  { value: 17, id: 16537 },
  { value: 18, id: 16538 },
  { value: 19, id: 16539 },
  { value: 20, id: 16540 },
  { value: 21, id: 16541 },
  { value: 22, id: 16542 },
  { value: 23, id: 16543 },
  { value: 24, id: 16544 },
  { value: 25, id: 16545 },
  { value: 26, id: 16546 },
  { value: 27, id: 16547 },
  { value: 28, id: 16548 },
  { value: 29, id: 16549 },
  { value: 30, id: 16550 },
  { value: 31, id: 16551 },
  { value: 32, id: 16552 },
  { value: 33, id: 16553 },
  { value: 34, id: 16554 },
  { value: 35, id: 16555 },
  { value: 36, id: 17759 },
  { value: 37, id: 17760 },
  { value: 38, id: 17761 },
  { value: 39, id: 17762 },
  { value: '40+', id: 18878 },
];

const windDirectionValues = [
  { value: 'S', id: 2461 },
  { value: 'SW', id: 2462 },
  { value: 'W', id: 2463 },
  { value: 'NW', id: 2464 },
  { value: 'N', id: 2465 },
  { value: 'NE', id: 2466 },
  { value: 'E', id: 2467 },
  { value: 'SE', id: 2468 },
  { value: 'No direction', id: 2469 },
];

const windSpeedValues = [
  { value: 'Smoke rises vertically', id: 2606 },
  { value: 'Slight smoke drift', id: 2453 },
  { value: 'Wind felt on face, leaves rustle', id: 2454 },
  { value: 'Leaves and twigs in slight motion', id: 2455 },
  { value: 'Dust raised and small branches move', id: 2456 },
  { value: 'Small trees in leaf begin to sway', id: 2457 },
  { value: 'Large branches move and trees sway', id: 2458 },
];

function transformToMeters(coordinates: any) {
  const transform = ([lat, lng]: any) => merc.forward([lat, lng]);
  return coordinates.map(transform);
}

export function getGeomString(shape: any) {
  const geoJSON = toJS(shape);
  if (geoJSON.type === 'Polygon') {
    geoJSON.coordinates[0] = transformToMeters(geoJSON.coordinates[0]);
  } else {
    geoJSON.coordinates = transformToMeters(geoJSON.coordinates);
  }

  return wkt.stringify(geoJSON);
}

export const dateAttr = {
  pageProps: {
    attrProps: {
      input: 'date',
      inputProps: { max: () => new Date() },
    },
  },
  remote: { values: (date: string) => dateFormat.format(new Date(date)) },
};

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: 'numeric',
});

const survey: Survey = {
  id: 685,
  name: 'single-species-count',

  attrs: {
    device: deviceAttr,
    appVersion: appVersionAttr,

    location: {
      remote: {
        id: 'entered_sref',
        values(location: any, submission: any) {
          const { accuracy, altitude, altitudeAccuracy } = location;

          // eslint-disable-next-line
          submission.values = {
            ...submission.values,
            geom: getGeomString(location.shape),
          };

          submission.values['smpAttr:282'] = accuracy; // eslint-disable-line
          submission.values['smpAttr:283'] = altitude; // eslint-disable-line
          submission.values['smpAttr:284'] = altitudeAccuracy; // eslint-disable-line
          submission.values['smpAttr:723'] = location.area; // eslint-disable-line

          return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
            location.longitude
          ).toFixed(7)}`;
        },
      },
    },

    date: dateAttr,

    startTime: {
      remote: {
        id: 287,
        values: (date: number) => dateTimeFormat.format(new Date(date)),
      },
    },

    locationName: {
      menuProps: { icon: business, label: 'Site name' },
      pageProps: {
        headerProps: { title: 'Site name' },
        attrProps: {
          input: 'input',
          info: 'Site name, e.g. nearby village',
        },
      },
    },

    duration: {
      remote: {
        id: 1643,
        values(timestamp: number) {
          // regex validation -> /^\d+:\d\d$/
          const seconds = Math.floor((timestamp / 1000) % 60);
          const formattedSeconds = seconds > 9 ? seconds : `0${seconds}`;

          const minutes = Math.floor(timestamp / MINUTE);

          return `${minutes}:${formattedSeconds}`;
        },
      },
    },

    cloud: {
      remote: {
        id: 1457,
      },
    },

    sun: {
      pageProps: {
        attrProps: {
          set: (value: any, sample: any) => {
            // check if value was actually set
            if (!Number.isFinite(value)) value = 0; // eslint-disable-line

            // eslint-disable-next-line no-param-reassign
            sample.data.cloud = 100 - value;
            // eslint-disable-next-line no-param-reassign
            sample.data.sun = value;
            sample.save();
          },
          input: 'slider',
          info: 'Please specify the % of sunshine.',
          inputProps: { max: 100, min: 0 },
        },
      },
      remote: { id: 286 },
    },

    temperature: {
      pageProps: {
        attrProps: {
          input: 'radio',
          info: 'Please specify the temperature C°.',
          inputProps: { options: temperatureValues },
        },
      },
      remote: { id: 1388, values: temperatureValues },
    },

    windDirection: {
      menuProps: { label: 'Wind Direction' },
      pageProps: {
        headerProps: { title: 'Wind Direction' },
        attrProps: {
          input: 'radio',
          info: 'Please specify the wind direction.',
          inputProps: { options: windDirectionValues },
        },
      },
      remote: { id: 1389, values: windDirectionValues },
    },

    windSpeed: {
      menuProps: { label: 'Wind Speed' },
      pageProps: {
        headerProps: { title: 'Wind Speed' },
        attrProps: {
          input: 'radio',
          info: 'Please specify the wind speed.',
          inputProps: { options: windSpeedValues },
        },
      },
      remote: { id: 1390, values: windSpeedValues },
    },

    comment: {
      menuProps: { icon: chatboxOutline, skipValueTranslation: true },
      pageProps: {
        attrProps: {
          input: 'textarea',
          info: 'Please add any extra info about this record.',
        },
      },
    },

    stage: {
      menuProps: { icon: caterpillarIcon },
      pageProps: {
        attrProps: {
          set: (value: string, sample: any) => {
            const getSamples = (subSample: any) => {
              const setDefaultStageValueToOcc = (occ: any) => {
                // eslint-disable-next-line no-param-reassign
                occ.data.stage = value;
                occ.save();
              };
              subSample.occurrences.forEach(setDefaultStageValueToOcc);
            };
            sample.samples.forEach(getSamples);

            // eslint-disable-next-line no-param-reassign
            sample.data.stage = value;
            sample.save();
          },
          input: 'radio',
          info: 'Pick the default life stage.',
          inputProps: { options: stageOptions },
        },
      },
    },
  },

  smp: {
    attrs: {
      date: dateAttr,

      location: {
        remote: {
          id: 'entered_sref',
          values(location: any, submission: any) {
            const { accuracy, altitude, altitudeAccuracy } = location;

            submission.values['smpAttr:282'] = accuracy; // eslint-disable-line
            submission.values['smpAttr:283'] = altitude; // eslint-disable-line
            submission.values['smpAttr:284'] = altitudeAccuracy; // eslint-disable-line

            if (!location.latitude) {
              return null; // if missing then sub-sample will be removed
            }

            return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
              location.longitude
            ).toFixed(7)}`;
          },
        },
      },
    },

    async create({ Sample, Occurrence, taxon, zeroAbundance, stage }) {
      const sample = new Sample({
        data: {
          surveyId: survey.id,
          enteredSrefSystem: 4326,
          location: {},
        },
      });

      const occurrence = await survey?.smp!.occ!.create!({
        Occurrence: Occurrence!,
        taxon,
      });

      sample.occurrences.push(occurrence);

      sample.occurrences[0].data.zeroAbundance = zeroAbundance;
      sample.occurrences[0].data.stage = stage;

      return sample;
    },

    occ: {
      attrs: {
        comment: {
          menuProps: { icon: chatboxOutline, skipValueTranslation: true },
          pageProps: {
            attrProps: {
              input: 'textarea',
              info: 'Please add any extra info about this record.',
            },
          },
        },

        count: {
          remote: {
            id: 780,
            values: (value: any, _: any, model: any) => {
              const hasZeroAbundance =
                model.data.zeroAbundance ||
                // backwards compatible
                model.data.zero_abundance;

              return hasZeroAbundance ? null : value;
            },
          },
        },

        stage: stageAttr,

        taxon: {
          remote: {
            id: 'taxa_taxon_list_id',
            values: (taxon: any) => taxon.warehouseId,
          },
        },
      },

      create({ Occurrence, taxon }) {
        return new Occurrence({
          data: {
            comment: null,
            taxon,
            count: 1,
          },
        });
      },
    },
  },

  verify(attrs) {
    // surveys details page dont set area attr
    // this block always runs for the multi-species survey
    if (attrs.startTime) {
      return object({
        locationName: z
          .string({ required_error: 'Required site name' })
          .nullable(),
        location: z.any().refine(
          d =>
            object({
              latitude: z.number().nullable(),
              longitude: z.number().nullable(),
              area: z.number().min(1),
              shape: z.object({}),
              source: z.string(),
            }).safeParse(d).success,
          { message: 'Please add survey area information' }
        ),
      }).safeParse(attrs).error;
    }

    return object({
      locationName: z
        .string({ required_error: 'Required site name' })
        .nullable(),
      sun: z.number({ required_error: 'Required sun' }).nullable(),
      windDirection: z
        .string({ required_error: 'Required wind direction' })
        .nullable(),
      windSpeed: z.string({ required_error: 'Required wind speed' }).nullable(),
      temperature: z
        .number({ required_error: 'Required temperature' })
        .nullable(),
    }).safeParse(attrs).error;
  },

  async create({ Sample }) {
    const sample = new Sample({
      metadata: {
        pausedTime: 0,
        timerPausedTime: null,
        startStopwatchTime: null,
      },
      data: {
        surveyId: survey.id,
        date: new Date().toISOString(),
        enteredSrefSystem: 4326,
        location: {},
        duration: 0,
        cloud: null,
        sun: null,
        stage: 'Adult',
      },
    });

    sample.toggleBackgroundGPS();
    sample.startMetOfficePull();

    return sample;
  },
};

export default survey;
