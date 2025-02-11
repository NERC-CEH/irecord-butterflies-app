import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import Occurrence from 'models/occurrence';
import Main from './Main';
import './styles.scss';

type Props = {
  occurrence: Occurrence;
};
const OccurrenceHome = ({ occurrence }: Props) => {
  if (!occurrence) {
    return null;
  }

  return (
    <Page id="survey-list-occurrence-edit">
      <Header title="Species" defaultHref="/home/surveys" />
      <Main occurrence={occurrence} />
    </Page>
  );
};

export default observer(OccurrenceHome);
