import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import { Page } from '@apps';
import { observer } from 'mobx-react';
import AppOccurrence from 'models/occurrence';
import Main from 'common/Components/Species';
import Header from './Header';

function SpeciesSelect({ sample, occurrence, appModel }) {
  const context = useContext(NavContext);

  const [searchPhrase, setSearchPhrase] = useState('');

  function onSelect(species) {
    const survey = sample.getSurvey();
    if (survey.name === 'point') {
      sample.occurrences[0].attrs.taxon = species; // eslint-disable-line
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
    context.goBack();
  }

  const getSpeciesID = occ => (occ.attrs.taxon || {}).id;
  const currentSpecies = sample.occurrences.map(getSpeciesID);

  return (
    <Page id="species-attr">
      <Header
        onSearch={setSearchPhrase}
        toggleFilter={appModel.toggleFilter}
        filters={appModel.attrs.filters}
      />
      <Main
        onSelect={onSelect}
        searchPhrase={searchPhrase}
        filters={appModel.attrs.filters}
        ignore={currentSpecies}
      />
    </Page>
  );
}

SpeciesSelect.propTypes = exact({
  sample: PropTypes.object.isRequired,
  appModel: PropTypes.object.isRequired,
  occurrence: PropTypes.object,
  match: PropTypes.object, // eslint-disable-line
  location: PropTypes.object, // eslint-disable-line
  history: PropTypes.object, // eslint-disable-line
});

export default observer(SpeciesSelect);