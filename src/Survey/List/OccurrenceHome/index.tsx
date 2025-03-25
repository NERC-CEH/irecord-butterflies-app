import { observer } from 'mobx-react';
import { Page, Header, useSample } from '@flumens';
import Occurrence from 'models/occurrence';
import Main from './Main';
import './styles.scss';

const OccurrenceHome = () => {
  const { occurrence } = useSample<any, Occurrence>();
  if (!occurrence) return null;

  return (
    <Page id="survey-list-occurrence-edit">
      <Header title="Species" defaultHref="/home/surveys" />
      <Main occurrence={occurrence} />
    </Page>
  );
};

export default observer(OccurrenceHome);
