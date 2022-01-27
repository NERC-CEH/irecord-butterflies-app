// @ts-ignore
import Wkt from 'wicket';
import { toJS } from 'mobx';
import L from 'leaflet';
import { Survey } from 'common/surveys';
import { chatboxOutline } from 'ionicons/icons';
import { stageAttr } from 'Survey/common/config';

const temperatureValues = [
  {
    value: '',
    label: 'Not recorded/no data',
    id: -1,
    isDefault: true,
  },
  { value: 10, id: -1 },
  { value: 11, id: -1 },
  { value: 12, id: -1 },
  { value: 13, id: -1 },
  { value: 14, id: -1 },
  { value: 15, id: -1 },
  { value: 16, id: -1 },
  { value: 17, id: -1 },
  { value: 18, id: -1 },
  { value: 19, id: -1 },
  { value: 20, id: -1 },
  { value: 21, id: -1 },
  { value: 22, id: -1 },
  { value: 23, id: -1 },
  { value: 24, id: -1 },
  { value: 25, id: -1 },
  { value: 26, id: -1 },
  { value: 27, id: -1 },
  { value: 28, id: -1 },
  { value: 29, id: -1 },
  { value: 30, id: -1 },
  { value: 31, id: -1 },
  { value: 32, id: -1 },
  { value: 33, id: -1 },
  { value: 34, id: -1 },
  { value: 35, id: -1 },
  { value: 36, id: -1 },
  { value: 37, id: -1 },
  { value: 38, id: -1 },
  { value: 39, id: -1 },
  { value: '40+', id: -1 },
];

const windDirectionValues = [
  { value: '', label: 'Not recorded/no data', id: -1, isDefault: true },
  { value: 'S', id: -1 },
  { value: 'SW', id: -1 },
  { value: 'W', id: -1 },
  { value: 'NW', id: -1 },
  { value: 'N', id: -1 },
  { value: 'NE', id: -1 },
  { value: 'E', id: -1 },
  { value: 'SE', id: -1 },
  { value: 'No direction', id: -1 },
];

const windSpeedValues = [
  { value: '', label: 'Not recorded/no data', id: -1, isDefault: true },
  { value: 'Smoke rises vertically', id: -1 },
  { value: 'Slight smoke drift', id: -1 },
  { value: 'Wind felt on face, leaves rustle', id: -1 },
  { value: 'Leaves and twigs in slight motion', id: -1 },
  { value: 'Dust raised and small branches move', id: -1 },
  { value: 'Small trees in leaf begin to sway', id: -1 },
  { value: 'Large branches move and trees sway', id: -1 },
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
  id: -1,
  name: 'single-species-count',

  attrs: {
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

          submission.values['smpAttr:-1'] = accuracy; // eslint-disable-line
          submission.values['smpAttr:-1'] = altitude; // eslint-disable-line
          submission.values['smpAttr:-1'] = altitudeAccuracy; // eslint-disable-line
          submission.values['smpAttr:-1'] = location.area; // eslint-disable-line

          return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
            location.longitude
          ).toFixed(7)}`;
        },
      },
    },
    cloud: {
      pageProps: {
        attrProps: {
          input: 'slider',
          info: 'Please specify the % of cloud cover.',
          inputProps: { max: 100, min: 0 },
        },
      },
      remote: { id: -1 },
    },

    temperature: {
      pageProps: {
        attrProps: {
          input: 'radio',
          info: 'Please specify the temperature C°.',
          inputProps: { options: temperatureValues },
        },
      },
      remote: { id: -1, values: temperatureValues },
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
      remote: { id: -1, values: windDirectionValues },
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
      remote: { id: -1, values: windSpeedValues },
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

            submission.values['smpAttr:-1'] = accuracy; // eslint-disable-line
            submission.values['smpAttr:-1'] = altitude; // eslint-disable-line
            submission.values['smpAttr:-1'] = altitudeAccuracy; // eslint-disable-line

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

        count: { remote: { id: -1 } },

        stage: stageAttr,
      },

      create(Occurrence: any, taxon: any, zeroAbundance) {
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

  verify() {},

  create(AppSample: any) {
    const sample = new AppSample({
      metadata: {
        survey: survey.name,
        survey_id: survey.id,
      },
      attrs: {
        location: {},
      },
    });

    sample.toggleGPStracking();

    return sample;
  },
};

export default survey;
