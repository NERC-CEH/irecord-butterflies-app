import { useEffect } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, Main, device, useToast, useLoader } from '@flumens';
import { observer } from 'mobx-react';
import {
  IonLabel,
  IonItemDivider,
  IonList,
  IonItem,
  IonRefresherContent,
  IonRefresher,
} from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import './styles.scss';

async function fetchStatsWrap(userModel, loader) {
  if (!device.isOnline) {
    return;
  }

  await loader.show('Please wait...');

  try {
    await userModel.fetchStats();
  } catch (err) {
    console.error(err);
    // do nothing
  }

  loader.hide();
}

function Statistics({ userModel }) {
  const toast = useToast();
  const loader = useLoader();

  const onRefresh = async event => {
    event.detail.complete();

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    fetchStatsWrap(userModel, loader);
  };

  const refreshStats = () => fetchStatsWrap(userModel, loader);
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
      <>
        <InfoBackgroundMessage className="info-background-message-plain">
          Swipe down to refresh statistics.
        </InfoBackgroundMessage>

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
              <IonLabel>
                <small>Species recorded (total)</small>
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
              <IonLabel>
                <small>Species recorded ({yearName})</small>
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

          <InfoBackgroundMessage name="showStatsWIPTip">
            <i>We will be adding more functionality to this page soon.</i>
          </InfoBackgroundMessage>
        </IonList>
      </>
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
}

Statistics.propTypes = exact({
  userModel: PropTypes.object.isRequired,
});

export default observer(Statistics);
