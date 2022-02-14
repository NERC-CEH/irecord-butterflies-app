import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { Page, Header, alert } from '@apps';
import { useRouteMatch } from 'react-router';
import { NavContext } from '@ionic/react';
import Main from './Main';
import './styles.scss';

function deleteSamplePrompt(callback: () => void) {
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
        handler: callback,
      },
    ],
  });
}

type Props = {
  sample: typeof Sample;
};

const SpeciesController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { goBack, navigate } = useContext(NavContext);

  const navigateToOccurrence = (smp: typeof Sample) => {
    const urlPath = match.url.split('/speciesOccurrences');
    urlPath.pop(); // go back to edit
    const occ = smp.occurrences[0];

    navigate(`${urlPath}/samples/${smp.cid}/occ/${occ.cid}`);
  };

  const deleteSampleWrap = (smp: typeof Sample) => {
    const taxon = { ...smp.occurrences[0].attrs.taxon };
    const deleteSample = async () => {
      await smp.destroy();

      const isLastSampleDeleted = sample.samples.length;
      if (!isLastSampleDeleted) {
        const survey = sample.getSurvey();

        const { defaultStage } = sample.attrs;
        const zeroAbundace = 't';
        const newSubSample = survey.smp.create(
          Sample,
          Occurrence,
          taxon,
          zeroAbundace,
          defaultStage
        );
        sample.samples.push(newSubSample);
        sample.save();

        goBack();
      }
    };

    deleteSamplePrompt(deleteSample);
  };

  return (
    <Page id="single-species-count-taxon-group">
      <Header title="Occurrences" />
      <Main
        sample={sample}
        deleteSample={deleteSampleWrap}
        navigateToOccurrence={navigateToOccurrence}
      />
    </Page>
  );
};

export default observer(SpeciesController);
