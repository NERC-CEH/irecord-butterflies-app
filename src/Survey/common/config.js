import * as Yup from 'yup';
import { date } from '@apps';
import { calendarOutline, locationOutline } from 'ionicons/icons';

const fixedLocationSchema = Yup.object().shape({
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
});

const validateLocation = val => {
  if (!val) {
    return false;
  }
  fixedLocationSchema.validateSync(val);
  return true;
};

export const verifyLocationSchema = Yup.mixed().test(
  'location',
  'Please select location.',
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
    id: 'date',
    values: d => date.print(d),
  },
};

export const locationAttr = {
  label: 'Location',
  icon: locationOutline,
  remote: {
    id: 'entered_sref',
    values(location) {
      return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
        location.longitude
      ).toFixed(7)}`;
    },
  },
};
