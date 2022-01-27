import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { Page, Header, alert } from '@apps';
import { useRouteMatch } from 'react-router';
import { NavContext, useIonViewWillEnter } from '@ionic/react';
import Main from './Main';
import './styles.scss';

function deleteSamplePrompt(cb: any) {
  alert({
    header: 'Delete',
    message: 'Are you sure you want to delete this occurrence?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: 'Delete',
        cssClass: 'secondary',
        handler: cb,
      },
    ],
  });
}

function byCreationDate(s1: typeof Sample, s2: typeof Sample) {
  const date1 = new Date(s1.metadata.updated_on);
  const date2 = new Date(s2.metadata.updated_on);

  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: typeof Sample;
};

const SpeciesController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { goBack, navigate } = useContext(NavContext);
  // const isDisabled = subSample.isUploaded();

  const navigateToOccurrence = (smp: typeof Sample) => {
    const urlPath = match.url.split('/speciesOccurrences');
    urlPath.pop(); // go back to edit
    const occ = smp.occurrences[0];

    navigate(`${urlPath}/samples/${smp.cid}/occ/${occ.cid}`);
  };

  const getSamples = () => {
    const { taxa }: any = match.params;

    const matchesTaxa = ({
      occurrences,
    }: {
      occurrences: typeof Occurrence[];
    }) => {
      const [occ] = occurrences; // always one
      return occ.attrs.taxon.warehouseId === parseInt(taxa, 10);
    };

    const samples = sample.samples.filter(matchesTaxa).sort(byCreationDate);

    return samples;
  };

  const navigateBackIfThereIsNoSubSamples = () =>
    !sample.samples.length && goBack();
  useIonViewWillEnter(navigateBackIfThereIsNoSubSamples);

  const deleteSampleWrap = (smp: typeof Sample) => {
    const deleteSample = async () => {
      await smp.destroy();

      const samples = getSamples();
      if (!samples.length) goBack();
    };

    deleteSamplePrompt(deleteSample);
  };

  return (
    <Page id="single-species-count-taxon-group">
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
