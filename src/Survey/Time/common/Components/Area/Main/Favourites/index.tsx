import { Trans as T } from 'react-i18next';
import { device, isValidLocation, useToast } from '@flumens';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  useIonViewWillLeave,
} from '@ionic/react';
import HeaderButton from 'Survey/common/Components/HeaderButton';
import Control from './Control';
import Sites from './Sites';

const SNAP_POSITIONS = [0, 0.4, 0.6, 1];
const DEFAULT_SNAP_POSITION = 0.4;

type Props = {
  isOpen: boolean;
  isGPSTracking: boolean;
  currentLocation?: any;
  onClose: any;
  selectedLocationId?: string | number;
  onCreateGroupLocation: any;
  onSelectGroupLocation: any;
};

const Favourites = ({
  isOpen,
  onClose,
  currentLocation,
  onCreateGroupLocation,
  onSelectGroupLocation,
  selectedLocationId,
  isGPSTracking,
}: Props) => {
  const toast = useToast();

  const area = currentLocation?.area || 0;
  const isInvalid =
    !isValidLocation(currentLocation) ||
    area <= 0 ||
    !device.isOnline ||
    isGPSTracking;
  const onCreateGroupLocationWrap = () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    if (isGPSTracking) {
      toast.warn('The survey area is still being tracked.');
      return;
    }

    if (isInvalid) {
      toast.warn('Your survey does not have a valid location to save.');
      return;
    }

    onCreateGroupLocation();
  };

  useIonViewWillLeave(onClose);

  return (
    <IonModal
      isOpen={isOpen}
      backdropDismiss={false}
      backdropBreakpoint={0.5}
      breakpoints={SNAP_POSITIONS}
      initialBreakpoint={!selectedLocationId ? 0.5 : DEFAULT_SNAP_POSITION}
      canDismiss
      onIonModalWillDismiss={onClose}
      className="[&::part(handle)]:mt-2"
    >
      <IonHeader class="ion-no-border">
        <IonToolbar className="ion-no-padding !p-0 [--background:var(--ion-page-background)] [--min-height:20px]">
          <div className="flex h-8 justify-between gap-4 px-2 py-1">
            <div className="flex items-center px-2 font-semibold text-black">
              <T>Your sites</T>
            </div>

            <HeaderButton
              onClick={onCreateGroupLocationWrap}
              isInvalid={isInvalid}
              className="text-sm"
            >
              Add
            </HeaderButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--padding-top:20px]">
        <Sites
          onSelect={onSelectGroupLocation}
          selectedLocationId={selectedLocationId}
        />
      </IonContent>
    </IonModal>
  );
};

Favourites.Control = Control;

export default Favourites;
