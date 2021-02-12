import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import { Page, Header } from '@apps';
import { observer } from 'mobx-react';
import Main from 'common/Components/Species';

function SpeciesSelect({ sample }) {
  const context = useContext(NavContext);

  function onSelect(species) {
    sample.occurrences[0].attrs.taxon = species; // eslint-disable-line
    sample.save();
    context.goBack();
  }

  return (
    <Page id="species-attr">
      <Header title="Select Species" />
      <Main onSelect={onSelect} />
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
