import { observer } from 'mobx-react';
import { Page, Header, useSample } from '@flumens';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import Main from './Main';
import './styles.scss';

const OccurrenceHome = () => {
  const { subSample, occurrence } = useSample<Sample, Occurrence>();

  if (!subSample || !occurrence) return null;

  return (
    <Page id="timed-species-count-edit-occurrence">
      <Header title="Edit Occurrence" />
      <Main occurrence={occurrence} subSample={subSample} />
    </Page>
  );
};

export default observer(OccurrenceHome);
