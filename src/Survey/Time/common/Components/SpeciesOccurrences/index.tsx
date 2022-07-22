import { FC, useContext } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { Page, Header, useAlert } from '@flumens';
import { useRouteMatch } from 'react-router';
import { NavContext, useIonViewWillEnter } from '@ionic/react';
import Main from './Main';
import './styles.scss';

const useDeleteConfirmation = () => {
  const alert = useAlert();

  const prompt = (resolve: any) => {
    alert({
      header: 'Delete',
      message: 'Are you sure you want to delete this occurrence?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => resolve(false),
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => resolve(true),
        },
      ],
    });
  };

  const promptWrap = () => new Promise(prompt);

  return promptWrap;
};

type Props = {
  sample: Sample;
};

function byCreationDate(s1: Sample, s2: Sample) {
  const date1 = new Date(s1.metadata.updated_on);
  const date2 = new Date(s2.metadata.updated_on);

  return date2.getTime() - date1.getTime();
}

const SpeciesController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { goBack, navigate } = useContext(NavContext);
  const confirmDelete = useDeleteConfirmation();

  const { taxa }: any = match.params;

  const navigateToOccurrence = (smp: Sample) => {
    const urlPath = match.url.split('/speciesOccurrences');
    urlPath.pop(); // go back to edit
    const occ = smp.occurrences[0];

    navigate(`${urlPath}/samples/${smp.cid}/occ/${occ.cid}`);
  };

  const deleteSampleWrap = async (smp: Sample) => {
    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    const taxon = { ...smp.occurrences[0].attrs.taxon };
    await smp.destroy();

    const byTaxonId = (s: Sample) =>
      s.occurrences[0].attrs.taxon.id === taxon.id;

    const isLastSampleDeleted = !sample.samples.filter(byTaxonId).length;

    if (isLastSampleDeleted && sample.isSurveyMultiSpeciesTimedCount()) {
      goBack();
      return;
    }

    if (isLastSampleDeleted) {
      const survey = sample.getSurvey();

      const { stage } = sample.attrs;
      const zeroAbundace = 't';
      const newSubSample = survey.smp.create(
        Sample,
        Occurrence,
        taxon,
        zeroAbundace,
        stage
      );
      sample.samples.push(newSubSample);
      sample.save();

      goBack();
    }
  };

  const getSamples = () => {
    const matchesTaxa = ({ occurrences }: any) => {
      const [occ] = occurrences; // always one
      return occ.attrs.taxon.warehouseId === parseInt(taxa, 10);
    };

    const samples = sample.samples.filter(matchesTaxa).sort(byCreationDate);

    return samples;
  };

  const navigateBackIfNoRemainingSamples = () => {
    const samples = getSamples();
    if (!samples.length) goBack();
  };
  useIonViewWillEnter(navigateBackIfNoRemainingSamples);

  return (
    <Page id="species-count-taxon-group">
      <Header title="Occurrences" />
      <Main
        sample={sample}
        samples={getSamples()}
        deleteSample={deleteSampleWrap}
        navigateToOccurrence={navigateToOccurrence}
      />
    </Page>
  );
};

export default observer(SpeciesController);
