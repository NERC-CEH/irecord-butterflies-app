import React from 'react';
import { observer } from 'mobx-react';
import exact from 'prop-types-exact';
import { Main, alert, Toggle, InfoMessage } from '@apps';
import PropTypes from 'prop-types';
import {
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  isPlatform,
  IonInput,
} from '@ionic/react';
import {
  arrowUndoSharp,
  shareSocialOutline,
  locationOutline,
  filterOutline,
} from 'ionicons/icons';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import getCurrentWeekNumber from 'helpers/weeks';
import clsx from 'clsx';
import './styles.scss';

function resetDialog(resetApp) {
  alert({
    header: 'Reset',
    skipTranslation: true,
    message: (
      <>
        Are you sure you want to reset the application to its initial state?
        <p>
          <b>This will wipe all the locally stored app data!</b>
        </p>
      </>
    ),
    buttons: [
      { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
      {
        text: 'Reset',
        cssClass: 'secondary',
        handler: resetApp,
      },
    ],
  });
}

@observer
class Component extends React.Component {
  static propTypes = exact({
    resetApp: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    onToggleGuideLocation: PropTypes.func.isRequired,
    onToggleProbabilitiesForGuide: PropTypes.func.isRequired,
    onToggleSmartSorting: PropTypes.func.isRequired,
    useSmartSorting: PropTypes.bool,
    useProbabilitiesForGuide: PropTypes.bool,
    useLocationForGuide: PropTypes.bool,
    sendAnalytics: PropTypes.bool,
    currentLocation: PropTypes.string,
    adminChangeWeek: PropTypes.func,
    adminChangeLocation: PropTypes.func,
  });

  getAdminControls = () => {
    const {
      currentLocation,
      adminChangeLocation,
      adminChangeWeek,
    } = this.props;

    const demoOnly = !isPlatform('hybrid');
    if (!demoOnly) return null;

    return (
      <div className="rounded">
        <InfoMessage color="medium">
          You can manually override the probability filter variables.
        </InfoMessage>
        <IonItem>
          <IonLabel position="floating">Current Hectad</IonLabel>
          <IonInput value={currentLocation} onIonChange={adminChangeLocation} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Current Week</IonLabel>
          <IonInput
            value={getCurrentWeekNumber()}
            onIonChange={adminChangeWeek}
          />
        </IonItem>
      </div>
    );
  };

  render() {
    const {
      resetApp,
      sendAnalytics,
      onToggle,
      useLocationForGuide,
      currentLocation,
      onToggleGuideLocation,
      onToggleProbabilitiesForGuide,
      onToggleSmartSorting,
      useSmartSorting,
      useProbabilitiesForGuide,
    } = this.props;

    const showAlertDialog = () => resetDialog(resetApp);

    const onSendAnalyticsToggle = checked => onToggle('sendAnalytics', checked);

    const currentLocationMessage = currentLocation ? (
      <>
        Current location is <b>{currentLocation}</b>.
      </>
    ) : (
      <>No location is currently set.</>
    );

    return (
      <Main>
        <IonList lines="full">
          <div className="rounded">
            <IonItem>
              <IonIcon icon={shareSocialOutline} size="small" slot="start" />
              <IonLabel>Share App Analytics</IonLabel>
              <Toggle
                onToggle={onSendAnalyticsToggle}
                checked={sendAnalytics}
              />
            </IonItem>
            <InfoMessage color="medium">
              Share app crash data so we can make the app more reliable.
            </InfoMessage>
          </div>

          <div className="rounded">
            <IonItem>
              <IonIcon icon={butterflyIcon} size="small" slot="start" />
              <IonLabel>Smart species lists</IonLabel>
              <Toggle
                onToggle={onToggleProbabilitiesForGuide}
                checked={useProbabilitiesForGuide}
              />
            </IonItem>
            <InfoMessage color="medium">
              Use our species lists based on your current time and location.
            </InfoMessage>

            <IonItem disabled={!useProbabilitiesForGuide}>
              <IonIcon icon={locationOutline} size="small" slot="start" />
              <IonLabel>Use current location</IonLabel>
              <Toggle
                onToggle={onToggleGuideLocation}
                checked={useLocationForGuide}
              />
            </IonItem>

            <InfoMessage
              color="medium"
              className={clsx(!useProbabilitiesForGuide && 'disabled')}
            >
              Filter the species list based on your current location.{' '}
              {currentLocationMessage}
            </InfoMessage>

            <IonItem disabled={!useProbabilitiesForGuide}>
              <IonIcon icon={filterOutline} size="small" slot="start" />
              <IonLabel>Use smart sorting</IonLabel>
              <Toggle
                onToggle={onToggleSmartSorting}
                checked={useSmartSorting}
              />
            </IonItem>

            <InfoMessage
              color="medium"
              className={clsx(!useProbabilitiesForGuide && 'disabled')}
            >
              Sort the species using probability information. Disabling it will
              default to alphabetical sorting.
            </InfoMessage>
          </div>
          {this.getAdminControls()}

          <div className="rounded">
            <IonItem id="app-reset-btn" onClick={showAlertDialog}>
              <IonIcon icon={arrowUndoSharp} size="small" slot="start" />
              Reset App
            </IonItem>
            <InfoMessage color="medium">
              You can reset the app data to its default settings.
            </InfoMessage>
          </div>
        </IonList>
      </Main>
    );
  }
}

export default Component;
