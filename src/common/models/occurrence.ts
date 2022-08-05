import {
  Occurrence,
  OccurrenceOptions,
  OccurrenceAttrs,
  validateRemoteModel,
} from '@flumens';
import { intercept } from 'mobx';
import species, { Species } from 'common/data/species';
// import { Result } from 'common/serv';
import Media from './image';

const POSSIBLE_THRESHOLD = 0.2;

type Attrs = OccurrenceAttrs & {
  taxon: Species;
  stage?: string;
  count?: number;
  zero_abundance?: 't' | 'f' | null;
};

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  attrs: Attrs = this.attrs;

  validateRemote = validateRemoteModel;

  constructor(props: OccurrenceOptions) {
    super(props);

    const setOnlyMinimalSpeciesValues = (change: any) => {
      const { warehouseId, id, scientificName, commonName } = change.newValue;
      change.newValue = { warehouseId, id, scientificName, commonName }; // eslint-disable-line
      return change;
    };
    intercept(this.attrs, 'taxon', setOnlyMinimalSpeciesValues);
  }

  setSpecies(speciesId: Species['id']) {
    const byId = ({ id }: Species) => id === speciesId;
    const sp = species.find(byId);
    if (!sp) {
      console.error(`Occ. setSpecies: no such species found ${speciesId}`);
      return;
    }

    this.attrs.taxon = sp;
  }

  getVerificationStatus() {
    const status = this.metadata?.verification?.verification_status;

    if (!status) return ''; // pending

    const substatus = this.metadata?.verification?.verification_substatus;

    if (status.match(/V/i)) return 'verified';
    if (status.match(/C/i) && substatus === '3') return 'plausible';
    if (status.match(/R/i)) return 'rejected';

    return ''; // pending
  }

  hasOccurrenceBeenVerified() {
    const isRecordInReview =
      this.metadata?.verification?.verification_status === 'C' &&
      this.metadata?.verification?.verification_substatus !== '3';

    return (
      this.isUploaded() && this.metadata?.verification && !isRecordInReview
    );
  }

  getVerificationStatusMessage() {
    const codes: { [keyof: string]: string } = {
      V: 'Accepted',
      V1: 'Accepted as correct',
      V2: 'Accepted as considered correct',

      C: 'Pending review',
      C3: 'Plausible',

      R: 'Not accepted',
      R4: 'Not accepted as unable to verify',
      R5: 'Not accepted as correct',

      // not supported
      D: 'Dubious',
      T: 'Test',
      I: 'Incomplete',
    };

    const statusWithSubstatus = `${this.metadata?.verification?.verification_status}${this.metadata?.verification?.verification_substatus}`;

    return codes[statusWithSubstatus];
  }

  hasZeroAbundance() {
    return this.attrs.zero_abundance === 't';
  }

  isDisabled() {
    return this.isUploaded();
  }

  getAllUniqueIdentifiedSpecies() {
    if (!this.media.length) return [];

    const byHightestProbability = (sp1: any, sp2: any) =>
      sp2.probability - sp1.probability;

    const getAllIdentifiedSpecies = (image: Media) => image.attrs.species;

    const uniqueSpecies = new Set();
    const removeDuplicates = (sp: any) => {
      const isDuplicate = uniqueSpecies.has(sp?.scientific_name);

      uniqueSpecies.add(sp?.scientific_name);

      if (!isDuplicate) return true;

      return false;
    };

    const withLowProbability = (sp: any) =>
      sp?.probability > POSSIBLE_THRESHOLD;

    return this.media
      .map(getAllIdentifiedSpecies)
      .flat()
      .sort(byHightestProbability)
      .filter(removeDuplicates)
      .filter(withLowProbability);
  }
}
