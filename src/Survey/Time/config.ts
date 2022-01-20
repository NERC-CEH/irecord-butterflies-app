// @ts-ignore
import Wkt from 'wicket';
import { toJS } from 'mobx';
import L from 'leaflet';
import { Survey } from 'common/surveys';

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
  },

  smp: {
    occ: {},
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

    return sample;
  },
};

export default survey;
