import { Occurrence, validateRemoteModel } from '@apps';
import { intercept } from 'mobx';
import species from 'common/data/species';
import Media from './image';

export default class AppOccurrence extends Occurrence {
  static fromJSON(json) {
    return super.fromJSON(json, Media);
  }

  validateRemote = validateRemoteModel;

  constructor(...props) {
    super(...props);

    const setOnlyMinimalSpeciesValues = change => {
      const { warehouseId, id, scientificName, commonName } = change.newValue;
      change.newValue = { warehouseId, id, scientificName, commonName }; // eslint-disable-line
      return change;
    };
    intercept(this.attrs, 'taxon', setOnlyMinimalSpeciesValues);
  }

  setSpecies(speciesId) {
    const byId = ({ id }) => id === speciesId;
    const sp = species.find(byId);
    if (!sp) {
      console.error(`Occ. setSpecies: no such species found ${speciesId}`);
      return;
    }

    this.attrs.taxon = sp;
  }

  getVerificationStatus = () => {
    const status = this.metadata?.verification?.verification_status;

    if (!status) return ''; // pending

    const substatus = this.metadata?.verification?.verification_substatus;

    if (status.match(/V/i)) return 'verified';
    if (status.match(/C/i) && substatus === '3') return 'plausible';
    if (status.match(/R/i)) return 'rejected';

    return ''; // pending
  };

  getVerificationStatusMessage = () => {
    const codes = {
      V: 'Accepted',
      V1: 'Accepted as correct',
      V2: 'Accepted as considered correct',

      C: 'Pending review',
      C3: 'Plausible',

      R: 'Not accepted',
      R4: 'Not accepted as unable to verify',
      R5: 'Not accepted as incorrect',

      D: 'Dubious',
      T: 'Test',
      I: 'Incomplete',
    };

    // TODO: Refactor to variable, what if not exist?
    const statusWithSubstatus = `${this.metadata?.verification?.verification_status}${this.metadata?.verification?.verification_substatus}`;

    return codes[statusWithSubstatus];
  };

  isDisabled = () => this.isUploaded();
}
