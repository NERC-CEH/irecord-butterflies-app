import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { chevronDownOutline } from 'ionicons/icons';
import { Page, Header, Main, useToast, useLoader } from '@flumens';
import {
  IonList,
  IonItem,
  IonRefresherContent,
  IonRefresher,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import userModel, { useUserStatusCheck } from 'models/user';

function useFetchStats() {
  const toast = useToast();
  const loader = useLoader();
  const checkUserStatus = useUserStatusCheck();

  async function fetchStats() {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    await loader.show('Please wait...');

    try {
      await userModel.fetchStats();
    } catch (err: any) {
      toast.error(err);
      // do nothing
    }

    loader.hide();
  }

  return fetchStats;
}

const Statistics = () => {
  const fetchStats = useFetchStats();

  const onRefresh = async (e: any) => {
    e.detail.complete();

    fetchStats();
  };

  const refreshStats = () => {
    fetchStats();
  };
  useEffect(refreshStats, []);

  const getReport = () => {
    if (!userModel.data.stats) {
      return (
        <InfoBackgroundMessage>
          Sorry, no report data is available at the moment. Pull down to
          refresh.
        </InfoBackgroundMessage>
      );
    }

    const {
      projectRecordsCount,
      myProjectRecords,
      myProjectSpecies,
      myProjectRecordsThisYear,
      myProjectSpeciesThisYear,
    } = userModel.data.stats;

    const yearName = new Date().getFullYear();

    return (
      <IonList lines="none">
        <div className="rounded-list">
          <div className="list-divider">My totals</div>
          <div className="flex items-center justify-between bg-white px-4 py-3">
            <div>
              <small>Records (total)</small>
            </div>
            <div className="text-right">
              <small>
                <b>{myProjectRecords}</b>
              </small>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white px-4 py-3">
            <div>
              <small>Records ({yearName})</small>
            </div>
            <div className="text-right">
              <small>
                <b>{myProjectRecordsThisYear}</b>
              </small>
            </div>
          </div>

          <IonItem
            routerLink="/user/statistics/details"
            detail
            className="[--padding-start:0] font-normal!"
          >
            <div className="flex items-center justify-between bg-white px-4 py-3 w-full">
              <div className="ion-text-wrap">
                <small>Butterfly species recorded (total)</small>
              </div>
              <div className="text-right">
                <small>
                  <b>{myProjectSpecies}</b>/64
                </small>
              </div>
            </div>
          </IonItem>

          <IonItem
            routerLink={`/user/statistics/details/${yearName}`}
            detail
            className="[--padding-start:0] font-normal!"
          >
            <div className="flex items-center justify-between bg-white px-4 py-3 w-full">
              <div className="ion-text-wrap">
                <small>Butterfly species recorded ({yearName})</small>
              </div>
              <div className="text-right">
                <small>
                  <b>{myProjectSpeciesThisYear}</b>/64
                </small>
              </div>
            </div>
          </IonItem>

          <div className="list-divider">App totals</div>
          <div className="flex items-center justify-between bg-white px-4 py-3">
            <div>
              <small>Records (total)</small>
            </div>
            <div className="text-right">
              <small>
                <b>{projectRecordsCount}</b>
              </small>
            </div>
          </div>
        </div>

        <InfoBackgroundMessage>
          Swipe down to refresh statistics.
        </InfoBackgroundMessage>
      </IonList>
    );
  };

  return (
    <Page id="user-statistics">
      <Header title="Statistics" />
      <Main>
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent pullingIcon={chevronDownOutline} />
        </IonRefresher>

        {getReport()}
      </Main>
    </Page>
  );
};

export default observer(Statistics);
