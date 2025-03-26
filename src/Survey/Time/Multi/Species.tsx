import { useContext } from 'react';
import { useRouteMatch } from 'react-router';
import { NavContext } from '@ionic/react';
import { Species as SpeciesType } from 'common/data/species';
import { useSample } from 'common/flumens';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import SpeciesComponent from 'Survey/common/Components/Species';
import survey from './config';

const Species = (props: any) => {
  const { sample, occurrence } = useSample<Sample>();

  const match = useRouteMatch();
  const { goBack } = useContext(NavContext);

  if (!sample) return null;

  async function onSelect(species: SpeciesType) {
    const { taxa }: any = match.params;

    if (taxa) {
      const selectedTaxon = ({ occurrences }: Sample) => {
        const [occ] = occurrences; // always one
        return occ.data.taxon.warehouseId === parseInt(taxa, 10);
      };
      const assignTaxon = ({ occurrences }: Sample) => {
        const [occ] = occurrences; // always one
        occ.data.taxon = species;
      };
      sample!.samples.filter(selectedTaxon).forEach(assignTaxon);

      await sample!.save();

      goBack();
      return;
    }

    if (occurrence) {
      // eslint-disable-next-line
      occurrence.data.taxon = species;
    } else {
      const newSample = await survey.smp.create({
        Sample,
        Occurrence,
        taxon: species,
        stage: 'Adult',
      });

      sample!.samples.push(newSample);
    }

    await sample!.save();

    goBack();
  }

  return <SpeciesComponent onSelect={onSelect} {...props} />;
};

export default Species;
