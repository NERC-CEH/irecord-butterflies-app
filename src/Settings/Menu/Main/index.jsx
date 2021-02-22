import React from 'react';
import { observer } from 'mobx-react';
import exact from 'prop-types-exact';
import { Main, alert, Toggle, InfoMessage } from '@apps';
import PropTypes from 'prop-types';
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { arrowUndoSharp, shareSocialOutline } from 'ionicons/icons';
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
    sendAnalytics: PropTypes.bool,
  });

  render() {
    const { resetApp, sendAnalytics, onToggle } = this.props;

    const showAlertDialog = () => resetDialog(resetApp);

    const onSendAnalyticsToggle = checked => onToggle('sendAnalytics', checked);

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
