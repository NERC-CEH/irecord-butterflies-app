import React from 'react';
import { Page } from '@apps';
import Main from 'common/Components/Species';
import Header from './Header';

function SpeciesGuideController() {
  return (
    <Page id="species-guide">
      <Header />
      <Main />
    </Page>
  );
}

export default SpeciesGuideController;
