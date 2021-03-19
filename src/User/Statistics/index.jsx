import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {
  Page,
  Header,
  Main,
  InfoBackgroundMessage,
  device,
  toast,
  loader,
} from '@apps';
import { observer } from 'mobx-react';
import {
  IonLabel,
  IonItemDivider,
  IonList,
  IonItem,
  IonButton,
} from '@ionic/react';
import fetchStats from './services';
import './styles.scss';

const { warn } = toast;

function Statistics({ userModel }) {
  // userModel.getStatistics();

  const onRefresh = async () => {
    if (!device.isOnline()) {
      warn("Sorry, looks like you're offline.");
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
  };

  const getReport = () => {
    if (!userModel.attrs.stats) {
      return (
        <InfoBackgroundMessage>
          Sorry, no report data is available at the moment.
        </InfoBackgroundMessage>
      );
    }

    const {
      myTotalRecords,
      projectRecordsCount,
      myProjectRecords,
      myProjectSpecies,
      myProjectRecordsThisYear,
      myProjectSpeciesThisYear,
      // projectSpeciesCount,
      // myProjectSpeciesRatio,
      // myProjectActivityRatio,
      // myProjectRarityMetric,
    } = userModel.attrs.stats;

    const yearName = new Date().getFullYear();

    return (
      <IonList lines="none">
        <i>This is work in progress...</i>
        <br />
        <br />

        <div className="rounded">
          <IonItemDivider mode="md">User</IonItemDivider>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Records</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>{myProjectRecords}</small>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Records ({yearName})</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>{myProjectRecordsThisYear}</small>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Species recorded</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>{myProjectSpecies}/65</small>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Species recorded ({yearName})</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>{myProjectSpeciesThisYear}/65</small>
            </IonLabel>
          </IonItem>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>iRecord records (total)</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>{myTotalRecords}</small>
            </IonLabel>
          </IonItem>

          <IonItemDivider mode="md">Survey</IonItemDivider>

          <IonItem lines="full" className="list-header-labels">
            <IonLabel>
              <small>Records (total)</small>
            </IonLabel>
            <IonLabel class="ion-text-right">
              <small>{projectRecordsCount}</small>
            </IonLabel>
          </IonItem>
        </div>
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
