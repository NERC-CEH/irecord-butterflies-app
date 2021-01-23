import React from 'react';
import { Page, Header } from '@apps';
import Main from './Main';

const MenuController = () => {
  return (
    <Page id="menu">
      <Header title="Menu" />
      <Main />
    </Page>
  );
};

export default MenuController;
