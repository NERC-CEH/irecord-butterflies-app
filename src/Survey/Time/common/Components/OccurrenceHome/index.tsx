import { FC } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import Main from './Main';
import './styles.scss';

type Props = {
  subSample: Sample;
  occurrence: Occurrence;
};

const OccurrenceHome: FC<Props> = ({ subSample, occurrence }) => (
  <Page id="timed-species-count-edit-occurrence">
    <Header title="Edit Occurrence" />
    <Main occurrence={occurrence} subSample={subSample} />
  </Page>
);

export default observer(OccurrenceHome);