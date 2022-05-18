import * as Yup from 'yup';
import { date } from '@flumens';
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
  isValid: val => val && val.toString() !== 'Invalid Date',
  menuProps: { parse: 'date', icon: calendarOutline },
  pageProps: {
    attrProps: {
      input: 'date',
      inputProps: { max: () => new Date() },
    },
  },
  remote: { values: d => date.print(d, false) },
};

export const locationAttrs = {
  location: {
    menuProps: { icon: locationOutline },
    remote: {
      id: 'entered_sref',
      values(location, submission) {
        // convert accuracy for map and gridref sources
        const { accuracy, source, gridref, altitude, name, altitudeAccuracy } =
          location;

        // add other location related attributes
        // eslint-disable-next-line
        submission.values = { ...submission.values };

        submission.values['smpAttr:760'] = source; // eslint-disable-line
        submission.values['smpAttr:335'] = gridref; // eslint-disable-line
        submission.values['smpAttr:282'] = accuracy; // eslint-disable-line
        submission.values['smpAttr:283'] = altitude; // eslint-disable-line
        submission.values['smpAttr:284'] = altitudeAccuracy; // eslint-disable-line
        submission.values['location_name'] = name; // eslint-disable-line

        const lat = parseFloat(location.latitude);
        const lon = parseFloat(location.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lat)) {
          return null;
        }

        return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
      },
    },
  },
};

export const deviceAttr = {
  id: 273,
  values: {
    ios: 2398,
    android: 2399,
  },
};

export const appVersionAttr = { id: 1139 };

export const stageOptions = [
  { value: 'Adult', id: 3929 },
  { value: 'Egg', id: 3932 },
  { value: 'Larva', id: 3931 },
  { value: 'Larval web', id: 14079 },
  { value: 'Pupa', id: 3930 },
];

export const stageAttr = {
  menuProps: { icon: caterpillarIcon },
  pageProps: {
    attrProps: {
      input: 'radio',
      info: 'Pick the life stage.',
      inputProps: { options: stageOptions },
    },
  },
  remote: { id: 293, values: stageOptions },
};
