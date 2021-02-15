import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import { Page } from '@apps';
import { observer } from 'mobx-react';
import Main from 'common/Components/Species';
import Header from './Header';

function SpeciesSelect({ sample }) {
  const context = useContext(NavContext);
  const [searchPhrase, setSearchPhrase] = useState('');

  function onSelect(species) {
    sample.occurrences[0].attrs.taxon = species; // eslint-disable-line
    sample.save();
    context.goBack();
  }

  return (
    <Page id="species-attr">
      <Header onSearch={setSearchPhrase} />
      <Main onSelect={onSelect} searchPhrase={searchPhrase} />
    </Page>
  );
}

SpeciesSelect.propTypes = exact({
  match: PropTypes.object, // eslint-disable-line
  location: PropTypes.object, // eslint-disable-line
  history: PropTypes.object, // eslint-disable-line
  sample: PropTypes.object.isRequired,
});

export default observer(SpeciesSelect);
