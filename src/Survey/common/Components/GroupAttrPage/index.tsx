import { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { Page, Main, Header, useSample } from '@flumens';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import GroupsList from './GroupsList';
import GroupsSegmentsAndSearch from './GroupsSegmentsAndSearch';

const GroupAttrPage = () => {
  const { goBack } = useContext(NavContext);
  const { sample } = useSample<Sample>();
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentType, setCurrentType] = useState<'joinable' | 'member'>(
    'member'
  );

  if (!sample) return null;

  const onSelect = async (groupId: string) => {
    // eslint-disable-next-line no-param-reassign
    sample.data.groupId = groupId;
    await sample.save();
    goBack();
  };

  const onJoinGroup = async () => {
    setCurrentSearch('');
    setCurrentType('member');
  };

  return (
    <Page id="survey-default-edit-group">
      <Header
        title="Activity"
        subheader={
          <GroupsSegmentsAndSearch
            onSearch={setCurrentSearch}
            onTypeChange={setCurrentType}
          />
        }
      />
      <Main>
        <GroupsList
          onSelect={onSelect}
          currentValue={sample.data.groupId}
          showAll={currentType === 'joinable'}
          currentSearch={currentSearch}
          onJoin={onJoinGroup}
          surveyForm="enter-app-record"
        />
      </Main>
    </Page>
  );
};

export default observer(GroupAttrPage);
