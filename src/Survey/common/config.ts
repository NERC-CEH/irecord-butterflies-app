import { calendarOutline, locationOutline } from 'ionicons/icons';
import {
  dateFormat,
  PageProps,
  RemoteConfig,
  MenuAttrItemFromModelMenuProps,
} from '@flumens';
import caterpillarIcon from 'common/images/caterpillar.svg';
import Media from 'common/models/image';
import Occurrence, { Taxon } from 'common/models/occurrence';
import Sample from 'common/models/sample';

// const fixedLocationSchema = Yup.object().shape({
//   latitude: Yup.number().required(),
//   longitude: Yup.number().required(),
//   name: Yup.string().required(),
// });

export const dateAttr = {
  menuProps: {
    icon: calendarOutline,
    attrProps: {
      input: 'date',
      inputProps: {
        max: () => new Date(),
        label: 'Date',
        icon: calendarOutline,
        autoFocus: false,
        usePrettyDates: true,
        presentation: 'date',
      },
    },
  },

  values: (date: any) => dateFormat.format(new Date(date)),
};

export const locationAttrs = {
  location: {
    menuProps: { icon: locationOutline },
    remote: {
      id: 'entered_sref',
      values(location: any, submission: any) {
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
  remote: {
    id: 273,
    values: {
      ios: 2398,
      android: 2399,
    },
  },
};

export const appVersionAttr = { remote: { id: 1139 } };

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

type MenuProps = MenuAttrItemFromModelMenuProps;

export type AttrConfig = {
  menuProps?: MenuProps;
  pageProps?: Omit<PageProps, 'attr' | 'model'>;
  remote?: RemoteConfig;
};

interface Attrs {
  [key: string]: AttrConfig;
}

type OccurrenceConfig = {
  render?: any[] | ((model: Occurrence) => any[]);
  attrs: Attrs;
  create?: (props: {
    Occurrence: typeof Occurrence;
    taxon?: Taxon;
    identifier?: string;
    photo?: any;
  }) => Occurrence;
  verify?: (attrs: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  /**
   * Set to true if multi-species surveys shouldn't auto-increment it to 1 when adding to lists.
   */
  skipAutoIncrement?: boolean;
};

export type SampleConfig = {
  render?: any[] | ((model: Sample) => any[]);
  attrs?: Attrs;
  create?: (props: {
    Sample: typeof Sample;
    Occurrence?: typeof Occurrence;
    taxon: Taxon;
    surveySample?: Sample;
    skipGPS?: boolean;
    zeroAbundance?: any;
    stage?: any;
  }) => Promise<Sample>;
  verify?: (attrs: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  smp?: SampleConfig;
  occ?: OccurrenceConfig;
};

export interface Survey extends SampleConfig {
  /**
   * Survey version.
   */
  version?: number;
  /**
   * Remote warehouse survey ID.
   */
  id: number;
  /**
   * In-App survey code name.
   */
  name: string;
  /**
   * Pretty survey name to show in the UI.
   */
  label?: string;
  /**
   * Remote website survey edit page path.
   */
  webForm?: string;
  /**
   * Which species group this config belongs to. Allows to link multiple taxon groups together under a common name.
   */
  taxa?: string;
  /**
   * Survey priority to take over other survey configs for the same species group.
   */
  taxaPriority?: number;
  icon?: any;
  /**
   * Informal taxon groups to use for the survey.
   */
  taxaGroups?: number[];
  /**
   * Custom survey getter. Processes the survey config.
   */
  get?: (sample: Sample) => Survey;

  create: (props: {
    Sample: typeof Sample;
    Occurrence?: typeof Occurrence;
    taxon?: Taxon;
    speciesId?: any;
    image?: Media | null;
    skipLocation?: boolean;
    skipGPS?: boolean;
    alert?: any;
  }) => Promise<Sample>;
}
