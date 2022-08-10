import { FC, useEffect } from 'react';
import { Page, Header, Main, useToast, useLoader } from '@flumens';
import { observer } from 'mobx-react';
import {
  IonLabel,
  IonItemDivider,
  IonList,
  IonItem,
  IonRefresherContent,
  IonRefresher,
} from '@ionic/react';
import userModel, { useUserStatusCheck } from 'models/user';
import { chevronDownOutline } from 'ionicons/icons';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import './styles.scss';

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

const Statistics: FC = () => {
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
    if (!userModel.attrs.stats) {
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
      // myTotalRecords,
      // projectSpeciesCount,
      // myProjectSpeciesRatio,
      // myProjectActivityRatio,
      // myProjectRarityMetric,
    } = userModel.attrs.stats;

    const yearName = new Date().getFullYear();

    return (
      <IonList lines="none">
        <div className="rounded">
          <IonItemDivider mode="md">My totals</IonItemDivider>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Records (total)</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>
                <b>{myProjectRecords}</b>
              </small>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Records ({yearName})</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>
                <b>{myProjectRecordsThisYear}</b>
              </small>
            </IonLabel>
          </IonItem>

          <IonItem
            lines="full"
            className="list-header-labels"
            routerLink="/user/statistics/details"
            detail
          >
            <IonLabel className="ion-text-wrap">
              <small>Butterfly species recorded (total)</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>
                <b>{myProjectSpecies}</b>/64
              </small>
            </IonLabel>
          </IonItem>

          <IonItem
            lines="full"
            className="list-header-labels"
            routerLink={`/user/statistics/details/${yearName}`}
            detail
          >
            <IonLabel className="ion-text-wrap">
              <small>Butterfly species recorded ({yearName})</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>
                <b>{myProjectSpeciesThisYear}</b>/64
              </small>
            </IonLabel>
          </IonItem>

          <IonItemDivider mode="md">App totals</IonItemDivider>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Records (total)</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>
                <b>{projectRecordsCount}</b>
              </small>
            </IonLabel>
          </IonItem>
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
