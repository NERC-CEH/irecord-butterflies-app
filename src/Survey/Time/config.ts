// @ts-ignore
import Wkt from 'wicket';
import * as Yup from 'yup';
import { date as dateHelp } from '@apps';
import { toJS } from 'mobx';
import L from 'leaflet';
import { Survey } from 'common/surveys';
import { chatboxOutline, business } from 'ionicons/icons';
import { stageAttr, deviceAttr, appVersionAttr } from 'Survey/common/config';

const temperatureValues = [
  {
    value: '',
    label: 'Not recorded/no data',
    id: 16556,
    isDefault: true,
  },
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
  { value: '', label: 'Not recorded/no data', id: 2460, isDefault: true },
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
  { value: '', label: 'Not recorded/no data', id: 2459, isDefault: true },
  { value: 'Smoke rises vertically', id: 2606 },
  { value: 'Slight smoke drift', id: 2453 },
  { value: 'Wind felt on face, leaves rustle', id: 2454 },
  { value: 'Leaves and twigs in slight motion', id: 2455 },
  { value: 'Dust raised and small branches move', id: 2456 },
  { value: 'Small trees in leaf begin to sway', id: 2457 },
  { value: 'Large branches move and trees sway', id: 2458 },
];

function transformToMeters(coordinates: any) {
  const transform = ([lng, lat]: [number, number]) => {
    const { x, y } = L.Projection.SphericalMercator.project({ lat, lng });
    return [x, y];
  };
  return coordinates.map(transform);
}

function getGeomString(shape: any) {
  const geoJSON = toJS(shape);
  if (geoJSON.type === 'Polygon') {
    geoJSON.coordinates[0] = transformToMeters(geoJSON.coordinates[0]);
  } else {
    geoJSON.coordinates = transformToMeters(geoJSON.coordinates);
  }

  const wkt = new Wkt.Wkt(geoJSON);
  return wkt.write();
}

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

    startTime: {
      remote: {
        id: 287,
        values: (date: any) => dateHelp.format(new Date(date)),
      },
    },

    site: {
      menuProps: { icon: business, label: 'Site name' },
      pageProps: {
        headerProps: { title: 'Site name' },
        attrProps: {
          input: 'input',
          info: 'Site name eg neay village',
        },
      },
      remote: { id: 'location_name' },
    },

    duration: {
      remote: { id: -1 },
    },

    sun: {
      pageProps: {
        attrProps: {
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
  },

  smp: {
    attrs: {
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

    create(AppSample, AppOccurrence, taxon, zeroAbundance) {
      const sample = new AppSample({
        metadata: {
          survey_id: survey.id,
          survey: survey.name,
        },
        attrs: {
          location: {},
        },
      });

      if (!sample.metadata.survey_id) {
        // TODO: remove this once it is known why this isn't set
        console.error(
          `Creating subsample had no survey_id so we are setting it to ${survey.id}`
        );
        sample.metadata.survey_id = survey.id; // eslint-disable-line
      }

      const occurrence = survey?.smp?.occ.create(
        AppOccurrence,
        taxon,
        zeroAbundance
      );

      sample.occurrences.push(occurrence);

      sample.occurrences[0].attrs.zero_abundance = zeroAbundance;

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

        count: { remote: { id: 780 } },

        stage: stageAttr,
      },

      create(Occurrence: any, taxon: any) {
        return new Occurrence({
          attrs: {
            comment: null,
            stage: 'Adult',
            taxon,
          },
        });
      },
    },
  },

  verify(attrs) {
    try {
      Yup.object()
        .shape({
          site: Yup.string().required(
            'Please ensure you fill in the site name field'
          ),
          sun: Yup.mixed()
            .notOneOf([null])
            .required('Please ensure you fill in the sun field'),
          windDirection: Yup.mixed()
            .notOneOf([null])
            .required('Please ensure you fill in the wind direction field'),
          windSpeed: Yup.mixed()
            .notOneOf([null])
            .required('Please ensure you fill in the wind speed field'),
          temperature: Yup.mixed()
            .notOneOf([null])
            .required('Please ensure you fill in the temperature field'),
        })

        .validateSync(attrs, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }
    return null;
  },

  create(AppSample: any) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
        pausedTime: 0,
        timerPausedTime: null,
      },
      attrs: {
        location: {},
        duration: 0,
      },
    });

    sample.attrs.surveyStartTime = sample.metadata.created_on; // this can't be done in defaults
    sample.startMetOfficePull();

    return sample;
  },
};

export default survey;
