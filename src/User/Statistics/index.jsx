import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header, Main, device, toast, loader } from '@apps';
import { observer } from 'mobx-react';
import {
  IonLabel,
  IonItemDivider,
  IonList,
  IonItem,
  IonButton,
  useIonViewDidEnter,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import fetchStats from './services';
import './styles.scss';

const { warn } = toast;

async function fetchStatsWrap(userModel) {
  if (!device.isOnline()) {
    return;
  }

  await loader.show({
    message: 'Please wait...',
  });

  try {
    const stats = await fetchStats(userModel);
    userModel.attrs.stats = stats; // eslint-disable-line
    userModel.save();
  } catch (err) {
    console.error(err);
    // do nothing
  }

  loader.hide();
}

function Statistics({ userModel }) {
  // userModel.getStatistics();

  const onRefresh = async () => {
    if (!device.isOnline()) {
      warn("Sorry, looks like you're offline.");
      return;
    }

    fetchStatsWrap(userModel);
  };

  const onViewEnteredRefreshStats = () => {
    if (!userModel.attrs.stats) {
      fetchStatsWrap(userModel);
    }
  };
  useIonViewDidEnter(onViewEnteredRefreshStats);

  const getReport = () => {
    if (!userModel.attrs.stats) {
      return (
        <InfoBackgroundMessage>
          Sorry, no report data is available at the moment.
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

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Species recorded (total)</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>
                <b>{myProjectSpecies}</b>/64
              </small>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" className="list-header-labels">
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
    );
  };

  const refreshButton = (
    <IonButton onClick={onRefresh} color="dark">
      Refresh
    </IonButton>
  );

  return (
    <Page id="user-statistics">
      <Header title="Statistics" rightSlot={refreshButton} />
      <Main>{getReport()}</Main>
    </Page>
  );
}

Statistics.propTypes = exact({
  userModel: PropTypes.object.isRequired,
});

export default observer(Statistics);
