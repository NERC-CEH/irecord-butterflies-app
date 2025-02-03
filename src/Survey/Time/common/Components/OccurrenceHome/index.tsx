import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import Main from './Main';
import './styles.scss';

type Props = {
  subSample: Sample;
  occurrence: Occurrence;
};

const OccurrenceHome = ({ subSample, occurrence }: Props) => (
  <Page id="timed-species-count-edit-occurrence">
    <Header title="Edit Occurrence" />
    <Main occurrence={occurrence} subSample={subSample} />
  </Page>
);

export default observer(OccurrenceHome);
