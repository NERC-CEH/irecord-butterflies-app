import { useState } from 'react';
import { Page } from '@flumens';
import Main from 'common/Components/SpeciesList';
import appModel from 'models/app';
import Header from './Header';

function SpeciesGuideController() {
  const [searchPhrase, setSearchPhrase] = useState('');

  return (
    <Page id="species-guide">
      <Header
        onSearch={setSearchPhrase}
        toggleFilter={appModel.toggleFilter}
        filters={appModel.attrs.filters}
      />
      <Main searchPhrase={searchPhrase} filters={appModel.attrs.filters} />
    </Page>
  );
}

export default SpeciesGuideController;
