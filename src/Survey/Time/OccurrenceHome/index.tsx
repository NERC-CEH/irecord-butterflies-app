import React, { FC } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { Page, Header } from '@apps';
import Main from './Main';
import './styles.scss';

type Props = {
  subSample: typeof Sample;
  occurrence: typeof Occurrence;
};

const OccurrenceHome: FC<Props> = ({ subSample, occurrence }) => {
  return (
    <Page id="single-species-count-edit-occurrence">
      <Header title="Edit Occurrence" />
      <Main occurrence={occurrence} subSample={subSample} />
    </Page>
  );
};

export default observer(OccurrenceHome);