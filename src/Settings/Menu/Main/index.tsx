import { FC } from 'react';
import { observer } from 'mobx-react';
import { Main, useAlert, InfoMessage, MenuAttrToggle } from '@flumens';
import {
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  isPlatform,
  IonInput,
} from '@ionic/react';
import {
  warningOutline,
  arrowUndoOutline,
  personRemoveOutline,
  shareSocialOutline,
  locationOutline,
  filterOutline,
} from 'ionicons/icons';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import mothIcon from 'common/images/mothIcon.svg';
import getCurrentWeekNumber from 'helpers/weeks';
import clsx from 'clsx';
import './styles.scss';

function resetDialog(resetApp: any, alert: any) {
  alert({
    header: 'Reset',
    skipTranslation: true,
    message: (
      <>
        Are you sure you want to reset the application to its initial state?
        <InfoMessage
          color="danger"
          icon={warningOutline}
          className="destructive-warning"
        >
          This will wipe all the locally stored app data!
        </InfoMessage>
      </>
    ),
    buttons: [
      { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
      {
        text: 'Reset',
        role: 'destructive',
        handler: resetApp,
      },
    ],
  });
}

function useUserDeleteDialog(deleteUser: any) {
  const alert = useAlert();

  const showUserDeleteDialog = () => {
    alert({
      header: 'Account delete',
      skipTranslation: true,
      message: (
        <>
          Are you sure you want to delete your account?
          <InfoMessage
            color="danger"
            icon={warningOutline}
            className="destructive-warning"
          >
            This will permanently remove your access to the iRecord website and
            any submitted records!
          </InfoMessage>
        </>
      ),
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: deleteUser,
        },
      ],
    });
  };

  return showUserDeleteDialog;
}

type Props = {
  resetApp: any;
  deleteUser: any;
  isLoggedIn: boolean;
  onToggle: any;
  onToggleGuideLocation: any;
  onToggleProbabilitiesForGuide: any;
  onToggleSmartSorting: any;
  useMoths: boolean;
  useSmartSorting?: boolean;
  useProbabilitiesForGuide?: boolean;
  useLocationForGuide?: boolean;
  sendAnalytics?: boolean;
  currentLocation?: string;
  adminChangeWeek?: any;
  adminChangeLocation?: any;
};

const MenuMain: FC<Props> = ({
  resetApp,
  isLoggedIn,
  deleteUser,
  sendAnalytics,
  onToggle,
  useLocationForGuide,
  currentLocation,
  onToggleGuideLocation,
  onToggleProbabilitiesForGuide,
  onToggleSmartSorting,
  useSmartSorting,
  useProbabilitiesForGuide,
  useMoths,
  adminChangeLocation,
  adminChangeWeek,
}) => {
  const alert = useAlert();
  const showUserDeleteDialog = useUserDeleteDialog(deleteUser);

  const getAdminControls = () => {
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

  const showResetDialog = () => resetDialog(resetApp, alert);

  const onSendAnalyticsToggle = (checked: boolean) =>
    onToggle('sendAnalytics', checked);

  const onUseMoths = (checked: boolean) => onToggle('useMoths', checked);

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
          <MenuAttrToggle
            icon={mothIcon}
            label="Enable moth species"
            value={useMoths}
            onChange={onUseMoths}
          />

          <MenuAttrToggle
            icon={butterflyIcon}
            label="Smart species lists"
            value={useProbabilitiesForGuide}
            onChange={onToggleProbabilitiesForGuide}
          />

          <InfoMessage color="medium">
            Use our species lists based on your current time and location.
          </InfoMessage>

          <MenuAttrToggle
            icon={locationOutline}
            label="Use current location"
            value={useLocationForGuide}
            onChange={onToggleGuideLocation}
            disabled={!useProbabilitiesForGuide}
            className={clsx(!useProbabilitiesForGuide && 'item-disabled')}
          />
          <InfoMessage
            color="medium"
            className={clsx(!useProbabilitiesForGuide && 'disabled')}
          >
            Filter the species list based on your current location.{' '}
            {currentLocationMessage}
          </InfoMessage>

          <MenuAttrToggle
            icon={filterOutline}
            label="Use smart sorting"
            value={useSmartSorting}
            onChange={onToggleSmartSorting}
            disabled={!useProbabilitiesForGuide}
            className={clsx(!useProbabilitiesForGuide && 'item-disabled')}
          />

          <InfoMessage
            color="medium"
            className={clsx(!useProbabilitiesForGuide && 'disabled')}
          >
            Sort the species using probability information. Disabling it will
            default to alphabetical sorting.
          </InfoMessage>
        </div>

        <div className="rounded">
          <MenuAttrToggle
            icon={shareSocialOutline}
            label="Share with app developers"
            value={sendAnalytics}
            onChange={onSendAnalyticsToggle}
          />
          <InfoMessage color="medium">
            Share app crash data so we can make the app more reliable.
          </InfoMessage>
        </div>

        {getAdminControls()}

        <div className="rounded destructive-item">
          <IonItem onClick={showResetDialog}>
            <IonIcon icon={arrowUndoOutline} size="small" slot="start" />
            <IonLabel>Reset app</IonLabel>
          </IonItem>
          <InfoMessage color="medium">
            You can reset the app data to its default settings.
          </InfoMessage>

          {isLoggedIn && (
            <>
              <IonItem onClick={showUserDeleteDialog}>
                <IonIcon icon={personRemoveOutline} size="small" slot="start" />
                <IonLabel>Delete account</IonLabel>
              </IonItem>
              <InfoMessage color="medium">
                You can delete your user account from the system.
              </InfoMessage>
            </>
          )}
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MenuMain);
