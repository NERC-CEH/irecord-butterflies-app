import { Occurrence } from '@apps';
import { intercept } from 'mobx';
import species from 'common/data/species';
import Media from './image';

export default class AppOccurrence extends Occurrence {
  static fromJSON(json) {
    return super.fromJSON(json, Media);
  }

  constructor(props) {
    super(props);

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
}
