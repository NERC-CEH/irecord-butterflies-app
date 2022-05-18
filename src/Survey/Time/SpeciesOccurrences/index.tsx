import React, { FC, useContext } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { Page, Header, useAlert } from '@apps';
import { useRouteMatch } from 'react-router';
import { NavContext } from '@ionic/react';
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
          cssClass: 'primary',
          handler: () => resolve(false),
        },
        {
          text: 'Delete',
          cssClass: 'secondary',
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

const SpeciesController: FC<Props> = ({ sample }) => {
  const match = useRouteMatch();
  const { goBack, navigate } = useContext(NavContext);
  const confirmDelete = useDeleteConfirmation();

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

    const isLastSampleDeleted = sample.samples.length;
    if (!isLastSampleDeleted) {
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
