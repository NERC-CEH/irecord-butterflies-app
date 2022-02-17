import React, { FC, useContext, useState } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import AppModelTypes from 'models/app';
import { NavContext } from '@ionic/react';
import { Page } from '@apps';
import { observer } from 'mobx-react';
import Main from 'common/Components/Species';
import { useRouteMatch } from 'react-router';
import { Species } from 'common/types';
import Header from './Header';

type Props = {
  sample: typeof Sample;
  occurrence: typeof Occurrence;
  appModel: typeof AppModelTypes;
  title?: string;
  BackButton?: React.ElementType;
};

const SpeciesSelect: FC<Props> = ({
  sample,
  occurrence,
  appModel,
  title,
  BackButton,
}) => {
  const { navigate, goBack } = useContext(NavContext);
  const match = useRouteMatch();

  const [searchPhrase, setSearchPhrase] = useState('');

  function onSelect(species: Species) {
    const survey = sample.getSurvey();
    if (survey.name === 'point') {
      const occ = sample.occurrences[0];
      if (!occ) {
        // TODO: remove this check after Beta
        console.error('No occurrence found when setting species');
        return;
      }
      occ.attrs.taxon = species; // eslint-disable-line
    }

    if (survey.name === 'single-species-count') {
      const zeroAbundance = 't';
      const newSubSample = survey.smp.create(
        Sample,
        Occurrence,
        species,
        zeroAbundance
      );

      sample.samples.push(newSubSample);
      sample.save();

      const url = match.url.replace('/species', '/details');
      navigate(url, 'forward', 'pop');

      return;
    }

    if (survey.name === 'list') {
      if (occurrence) {
        occurrence.attrs.taxon = species; // eslint-disable-line
      } else {
        const occ = survey.occ.create(Occurrence, species);
        sample.occurrences.push(occ);
      }
    }

    sample.save();
    goBack();
  }

  const getSpeciesID = (occ: typeof Occurrence) => (occ.attrs.taxon || {}).id;

  const isSpeciesSelected = sample?.samples[0]?.occurrences || [];
  const isSurveySingleCount = sample.isSurveySingleSpeciesTimedCount()
    ? isSpeciesSelected
    : sample.occurrences;

  const currentSpecies = isSurveySingleCount.map(getSpeciesID);

  return (
    <Page id="species-attr">
      <Header
        onSearch={setSearchPhrase}
        toggleFilter={appModel.toggleFilter}
        filters={appModel?.attrs?.filters}
        BackButton={BackButton}
        title={title}
      />
      <Main
        onSelect={onSelect}
        searchPhrase={searchPhrase}
        filters={appModel?.attrs?.filters}
        ignore={currentSpecies}
      />
    </Page>
  );
};

export default observer(SpeciesSelect);
