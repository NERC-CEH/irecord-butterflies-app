import React, { FC } from 'react';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { Page, Header } from '@apps';
import Main from './Main';

type Props = {
  sample: typeof Sample;
};

const HomeController: FC<Props> = ({ sample }) => {
  return (
    <Page id="single-species-count-edit">
      <Header />
      <Main sample={sample} />
    </Page>
  );
};

export default observer(HomeController);
