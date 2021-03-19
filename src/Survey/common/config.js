import * as Yup from 'yup';
import { date } from '@apps';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import caterpillarIcon from 'common/images/caterpillar.svg';

const fixedLocationSchema = Yup.object().shape({
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
  name: Yup.string().required(),
});

const validateLocation = val => {
  try {
    fixedLocationSchema.validateSync(val);
    return true;
  } catch (e) {
    return false;
  }
};

export const verifyLocationSchema = Yup.mixed().test(
  'location',
  'Please enter location and its name.',
  validateLocation
);

export const dateAttr = {
  type: 'date',
  label: 'Date',
  icon: calendarOutline,
  isValid: val => val && val.toString() !== 'Invalid Date',
  max: () => new Date(),
  required: true,
  remote: {
    values: d => date.print(d, false),
  },
};

export const locationAttrs = {
  location: {
    label: 'Location',
    icon: locationOutline,
    remote: {
      id: 'entered_sref',
      values(location, submission) {
        // convert accuracy for map and gridref sources
        const { accuracy, source, gridref, altitude, name } = location;

        const locationAttributes = {
          location_name: name, // location_name is a native indicia attr
          [locationAttrs.locationSource.remote.id]: source,
          [locationAttrs.locationGridref.remote.id]: gridref,
          [locationAttrs.locationAltitude.remote.id]: altitude,
          [locationAttrs.locationAltitudeAccuracy.remote.id]:
            location.altitudeAccuracy,
          [locationAttrs.locationAccuracy.remote.id]: accuracy,
        };

        // add other location related attributes
        // eslint-disable-next-line
        submission.fields = { ...submission.fields, ...locationAttributes };

        const lat = parseFloat(location.latitude);
        const lon = parseFloat(location.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lat)) {
          return null;
        }

        return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
      },
    },
  },
  locationAccuracy: { remote: { id: 282 } },
  locationAltitude: { remote: { id: 283 } },
  locationAltitudeAccuracy: { remote: { id: 284 } },
  locationSource: { remote: { id: 760 } },
  locationGridref: { remote: { id: 335 } },
};

const stageOptions = [
  { value: 'Adult', id: 3929 },
  { value: 'Larva', id: 3931 },
  { value: 'Egg', id: 3932 },
  { value: 'Pupae', id: 3930 },
  { value: 'Larval web', id: 14079 },
];

export const stageAttr = {
  label: 'Stage',
  type: 'radio',
  info: 'Pick the life stage.',
  icon: caterpillarIcon,
  componentProps: {
    options: stageOptions,
  },
  remote: {
    id: 293,
    values: stageOptions,
  },
};
