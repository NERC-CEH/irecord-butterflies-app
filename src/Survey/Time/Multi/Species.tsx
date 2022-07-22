import { useContext } from 'react';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import SpeciesComponent from 'Survey/common/Components/Species';
import { useRouteMatch } from 'react-router';
import { Species as SpeciesType } from 'common/data/species';
import survey from './config';

const Species = (props: any) => {
  const { sample, occurrence } = props;
  const match = useRouteMatch();
  const { goBack } = useContext(NavContext);

  async function onSelect(species: SpeciesType) {
    const { taxa }: any = match.params;

    if (taxa) {
      const selectedTaxon = ({ occurrences }: Sample) => {
        const [occ] = occurrences; // always one
        return occ.attrs.taxon.warehouseId === parseInt(taxa, 10);
      };
      const assignTaxon = ({ occurrences }: Sample) => {
        const [occ] = occurrences; // always one
        occ.attrs.taxon = species;
      };
      sample.samples.filter(selectedTaxon).forEach(assignTaxon);

      await sample.save();

      goBack();
      return;
    }

    if (occurrence) {
      // eslint-disable-next-line
      occurrence.attrs.taxon = species;
    } else {
      const newSample = survey.smp.create(
        Sample,
        Occurrence,
        species,
        null,
        'Adult'
      );

      sample.samples.push(newSample);
    }

    await sample.save();

    goBack();
  }

  return <SpeciesComponent onSelect={onSelect} {...props} />;
};

export default Species;
