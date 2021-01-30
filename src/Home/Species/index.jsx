import React from 'react';
import { Page } from '@apps';
import Header from './Header';
import Main from './Main';

function SpeciesGuideController() {
  return (
    <Page id="species-guide">
      <Header />
      <Main />
    </Page>
  );
}

export default SpeciesGuideController;
