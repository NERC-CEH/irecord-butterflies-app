import {
  Occurrence,
  OccurrenceOptions,
  OccurrenceAttrs,
  validateRemoteModel,
} from '@flumens';
import { intercept } from 'mobx';
import species, { Species } from 'common/data/species';
import Media from './image';

type Attrs = OccurrenceAttrs & { taxon: Species; stage: string };

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

  isDisabled() {
    return this.isUploaded();
  }
}
