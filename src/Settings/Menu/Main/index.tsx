import { observer } from 'mobx-react';
import clsx from 'clsx';
import {
  warningOutline,
  arrowUndoOutline,
  personRemoveOutline,
  shareSocialOutline,
  locationOutline,
  filterOutline,
  cameraOutline,
  mailOutline,
} from 'ionicons/icons';
import { Main, useAlert, InfoMessage, Toggle } from '@flumens';
import {
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  isPlatform,
  IonInput,
} from '@ionic/react';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import mothIcon from 'common/images/mothIcon.svg';
import getCurrentWeekNumber from 'helpers/weeks';
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
          prefix={<IonIcon src={warningOutline} className="size-6" />}
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
            prefix={<IonIcon src={warningOutline} className="size-6" />}
            className="destructive-warning"
          >
            This will remove your account on the iRecord website. You will lose
            access to any records that you have previously submitted using the
            app or website.
          </InfoMessage>
        </>
      ),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
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
  useSpeciesImageClassifier: boolean;
  useSmartSorting?: boolean;
  useProbabilitiesForGuide?: boolean;
  useLocationForGuide?: boolean;
  sendAnalytics?: boolean;
  allowMarketing?: boolean;
  currentLocation?: string;
  adminChangeWeek?: any;
  adminChangeLocation?: any;
  updateMarketingSetting?: any;
};

const MenuMain = ({
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
  useSpeciesImageClassifier,
  allowMarketing,
  updateMarketingSetting,
}: Props) => {
  const alert = useAlert();
  const showUserDeleteDialog = useUserDeleteDialog(deleteUser);

  const getAdminControls = () => {
    const demoOnly = !isPlatform('hybrid');
    if (!demoOnly) return null;

    return (
      <div className="rounded-list">
        <InfoMessage inline>
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

  const onUseImageClassifier = (checked: boolean) =>
    onToggle('useSpeciesImageClassifier', checked);

  const currentLocationMessage = currentLocation ? (
    <>
      Current location is <b>{currentLocation}</b>.
    </>
  ) : (
    <>No location is currently set.</>
  );

  return (
    <Main className="[--padding-bottom:30px]">
      <IonList lines="full">
        <div className="flex flex-col gap-3">
          <div className="rounded-list">
            <Toggle
              prefix={<IonIcon src={cameraOutline} className="size-6" />}
              label="Suggest species"
              defaultSelected={useSpeciesImageClassifier}
              onChange={onUseImageClassifier}
            />
            <InfoMessage inline>
              Use image recognition to identify species from your photos.
            </InfoMessage>

            <Toggle
              prefix={<IonIcon src={mothIcon} className="size-6" />}
              label="Enable moth species"
              defaultSelected={useMoths}
              onChange={onUseMoths}
            />

            <Toggle
              prefix={<IonIcon src={butterflyIcon} className="size-6" />}
              label="Smart species lists"
              defaultSelected={useProbabilitiesForGuide}
              onChange={onToggleProbabilitiesForGuide}
            />

            <InfoMessage inline>
              Use our species lists based on your current time and location.
            </InfoMessage>

            <Toggle
              prefix={<IonIcon src={locationOutline} className="size-6" />}
              label="Use current location"
              defaultSelected={useLocationForGuide}
              onChange={onToggleGuideLocation}
              isDisabled={!useProbabilitiesForGuide}
              className={clsx(!useProbabilitiesForGuide && 'item-disabled')}
            />
            <InfoMessage
              inline
              className={clsx(!useProbabilitiesForGuide && 'disabled')}
            >
              Filter the species list based on your current location.{' '}
              {currentLocationMessage}
            </InfoMessage>

            <Toggle
              prefix={<IonIcon src={filterOutline} className="size-6" />}
              label="Use smart sorting"
              defaultSelected={useSmartSorting}
              onChange={onToggleSmartSorting}
              isDisabled={!useProbabilitiesForGuide}
              className={clsx(!useProbabilitiesForGuide && 'item-disabled')}
            />

            <InfoMessage
              inline
              className={clsx(!useProbabilitiesForGuide && 'disabled')}
            >
              Sort the species using probability information. Disabling it will
              default to alphabetical sorting.
            </InfoMessage>
          </div>

          <div className="rounded-list">
            <Toggle
              prefix={<IonIcon src={mailOutline} className="size-6" />}
              label="Receive BC news"
              isSelected={allowMarketing}
              onChange={updateMarketingSetting}
            />
            <InfoMessage inline>
              Allow Butterfly Conservation to keep you updated with news about
              campaigns and other work by email.
            </InfoMessage>
            <Toggle
              prefix={<IonIcon src={shareSocialOutline} className="size-6" />}
              label="Share with app developers"
              defaultSelected={sendAnalytics}
              onChange={onSendAnalyticsToggle}
            />
            <InfoMessage inline>
              Share app crash data so we can make the app more reliable.
            </InfoMessage>
          </div>

          {getAdminControls()}

          <div className="destructive-item rounded-list">
            <IonItem onClick={showResetDialog}>
              <IonIcon src={arrowUndoOutline} size="small" slot="start" />
              <IonLabel>Reset app</IonLabel>
            </IonItem>
            <InfoMessage inline>
              You can reset the app data to its default settings.
            </InfoMessage>

            {isLoggedIn && (
              <>
                <IonItem onClick={showUserDeleteDialog}>
                  <IonIcon
                    src={personRemoveOutline}
                    size="small"
                    slot="start"
                  />
                  <IonLabel>Delete account</IonLabel>
                </IonItem>
                <InfoMessage inline>
                  You can delete your user account from the system.
                </InfoMessage>
              </>
            )}
          </div>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MenuMain);
