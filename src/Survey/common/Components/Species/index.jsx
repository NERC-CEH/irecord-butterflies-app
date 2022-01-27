import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import { Page } from '@apps';
import { observer } from 'mobx-react';
import AppOccurrence from 'models/occurrence';
import AppSample from 'models/sample';
import Main from 'common/Components/Species';
import { useRouteMatch } from 'react-router';
import Header from './Header';

function SpeciesSelect({ sample, occurrence, appModel }) {
  const { navigate, goBack } = useContext(NavContext);
  const match = useRouteMatch();

  const [searchPhrase, setSearchPhrase] = useState('');

  function onSelect(species) {
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
      const { taxa } = match.params;
      if (taxa) {
        const assignTaxon = ({ occurrences }) => {
          const [occ] = occurrences; // always one
          occ.attrs.taxon = species;
        };

        sample.samples.forEach(assignTaxon);

        sample.save();

        const [url] = match.url.split('/speciesOccurrences');
        navigate(url, 'pop');

        return;
      }
      const zeroAbundance = 't';
      const newSubSample = survey.smp.create(
        AppSample,
        AppOccurrence,
        species,
        zeroAbundance
      );
      sample.samples.push(newSubSample);
      // newSubSample.startGPS();
    }

    if (survey.name === 'list') {
      if (occurrence) {
        occurrence.attrs.taxon = species; // eslint-disable-line
      } else {
        const occ = survey.occ.create(AppOccurrence, species);
        sample.occurrences.push(occ);
      }
    }

    sample.save();
    goBack();
  }

  const getSpeciesID = occ => (occ.attrs.taxon || {}).id;

  const isSpeciesSelected = sample?.samples[0]?.occurrences || [];
  const isSurveySingleCount =
    sample.metadata.survey === 'single-species-count'
      ? isSpeciesSelected
      : sample.occurrences;

  const currentSpecies = isSurveySingleCount.map(getSpeciesID);

  return (
    <Page id="species-attr">
      <Header
        onSearch={setSearchPhrase}
        toggleFilter={appModel.toggleFilter}
        filters={appModel?.attrs?.filters}
      />
      <Main
        onSelect={onSelect}
        searchPhrase={searchPhrase}
        filters={appModel?.attrs?.filters}
        ignore={currentSpecies}
      />
    </Page>
  );
}

SpeciesSelect.propTypes = exact({
  sample: PropTypes.object.isRequired,
  appModel: PropTypes.object.isRequired,
  occurrence: PropTypes.object,
});

export default observer(SpeciesSelect);
