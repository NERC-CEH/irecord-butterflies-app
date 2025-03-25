import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { IonRefresher, IonRefresherContent } from '@ionic/react';
import {
  byGroupMembershipStatus,
  device,
  useLoader,
  useToast,
} from 'common/flumens';
import appModel from 'common/models/app';
import groups from 'common/models/collections/groups';
import Group from 'models/group';
import { useUserStatusCheck } from 'models/user';
import AllGroups from './All';
import UserGroups from './User';

type Props = {
  currentValue?: any;
  currentSearch?: any;
  showAll: boolean;
  surveyForm: string;
  onSelect?: (groupId: string) => void;
  onJoin: (group: Group) => void;
};

const GroupsList = ({
  onSelect,
  currentValue: currentValueProp,
  currentSearch,
  showAll,
  onJoin,
  surveyForm,
}: Props) => {
  const toast = useToast();
  const loader = useLoader();
  const checkUserStatus = useUserStatusCheck();

  // eslint-disable-next-line
  groups.length; // to force refresh when groups list is updated

  const currentValue = currentValueProp || appModel.data.lastGroupId;

  const joinGroup = async (group: Group) => {
    console.log('Activities joining', group.id);

    try {
      await loader.show('Please wait...');
      await group.join();
      await groups.fetchRemote({ type: 'member', form: [surveyForm] });
      await groups.fetchRemote({ type: 'pending' as any, form: [surveyForm] });
      await groups.fetchRemote({ type: 'joinable', form: [surveyForm] });

      toast.success('Successfully joined the activity.');
    } catch (err: any) {
      toast.error(err);
    }

    onJoin(group);
    loader.hide();
  };

  const leaveGroup = async (group: Group) => {
    console.log('Activities leaving', group.id);

    try {
      await loader.show('Please wait...');
      await group.leave();
      await groups.fetchRemote({ type: 'member', form: [surveyForm] });
      await groups.fetchRemote({ type: 'pending' as any, form: [surveyForm] });
      await groups.fetchRemote({ type: 'joinable', form: [surveyForm] });

      delete appModel.data.lastGroupId;

      toast.success('Successfully left the activity.');
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  const refreshGroups = async (type: 'member' | 'joinable') => {
    console.log('Groups refreshing', type);

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    await loader.show('Please wait...');

    try {
      await groups.fetchRemote({ type, form: [surveyForm] });
      if (type === 'member') {
        await groups.fetchRemote({
          type: 'pending' as any,
          form: [surveyForm],
        });
      }
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  const byTitle = (group1: Group, group2: Group) =>
    group1.data.title?.localeCompare(group2.data.title);

  const bySearchPhrase = (group: Group) =>
    !currentSearch ||
    group.data.title.toLowerCase().includes(currentSearch.toLowerCase());

  const filteredGroups = groups
    .filter(byGroupMembershipStatus(showAll ? 'joinable' : 'member'))
    .filter(bySearchPhrase)
    .sort(byTitle);

  useEffect(() => {
    if (!filteredGroups.length) refreshGroups(showAll ? 'joinable' : 'member');
  }, [showAll]);

  const [reachedTopOfList, setReachedTopOfList] = useState(true);

  const onScroll = ({ scrollOffset }: any) =>
    setReachedTopOfList(scrollOffset < 80);

  const refreshGroupsWrap = async (e: any) => {
    e?.detail?.complete(); // refresh pull update
    refreshGroups(!showAll ? 'member' : 'joinable');
  };

  return (
    <>
      <IonRefresher
        slot="fixed"
        disabled={showAll && !reachedTopOfList}
        onIonRefresh={refreshGroupsWrap}
      >
        <IonRefresherContent />
      </IonRefresher>

      {!showAll && (
        <UserGroups
          currentValue={currentValue}
          onSelect={onSelect}
          onLeave={leaveGroup}
          groups={filteredGroups}
        />
      )}

      {showAll && (
        <AllGroups
          groups={filteredGroups}
          onJoin={joinGroup!}
          onScroll={onScroll}
        />
      )}
    </>
  );
};

export default observer(GroupsList);
