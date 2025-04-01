import { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { resizeOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { device, useLoader, useSample, useToast } from '@flumens';
import { IonIcon, IonPage, NavContext } from '@ionic/react';
import Media from 'common/models/image';
import locations from 'models/collections/locations';
import LocationModel, { Data } from 'models/location';
import Sample from 'models/sample';
import userModel from 'models/user';
import Header from './Header';
import Main from './Main';
import NewLocationModal from './NewLocationModal';
import './styles.scss';

const AreaController = () => {
  const { goBack } = useContext(NavContext);
  const loader = useLoader();
  const toast = useToast();

  const { sample } = useSample<Sample>();
  if (!sample) throw new Error('Sample is missing');

  const toggleGPStracking = (on: boolean) => {
    sample!.toggleBackgroundGPS(on);
  };

  const setLocation = (shape: any) => {
    sample.setAreaLocation(shape);
  };

  const location = sample.data.location || {};
  const isGPSTracking = sample.isGPSRunning();
  const { area } = location;

  let infoText;
  if (area) {
    infoText = (
      <div className="text-with-icon-wrapper">
        <IonIcon icon={resizeOutline} />
        <T>Selected area</T>: {area.toLocaleString()} m²
      </div>
    );
  } else {
    infoText = (
      <>
        <T>Please draw your area on the map</T>
        {isGPSTracking && (
          <div>
            <T>Disable the GPS tracking to enable the drawing tools.</T>
          </div>
        )}
      </>
    );
  }

  const { isDisabled } = sample;

  const isAreaShape = location.shape?.type === 'Polygon';

  const [isNewLocationModalOpen, setNewLocationModalOpen] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const onCreateSite = () => modal.current?.present();
  const onSelectSite = (loc?: LocationModel) => {
    sample.data.locationId = loc?.id;
    sample.save();
    goBack();
  };

  const page = useRef(null);

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  const refreshLocations = () => {
    if (
      isDisabled ||
      !userModel.isLoggedIn() ||
      !userModel.data.verified ||
      !device.isOnline
    )
      return;

    locations.fetchRemote();
  };
  useEffect(refreshLocations, []);

  const onCloseLocationModal = () => setNewLocationModalOpen(false);

  const onSaveNewLocation = async (newSiteAttrs: Data, media: Media[]) => {
    if (!userModel.isLoggedIn() || !userModel.data.verified || !device.isOnline)
      return false;

    try {
      await loader.show('Please wait...');

      const newSite = new LocationModel({
        skipStore: true,
        data: newSiteAttrs as any, // any - to fix Moth trap attrs
        media,
      });
      await newSite.saveRemote();
      await refreshLocations();

      toast.success('Successfully saved a location.');
    } catch (err: any) {
      toast.error(err);
      loader.hide();
      return false;
    }

    loader.hide();
    return true;
  };

  return (
    <IonPage id="area" ref={page}>
      <Header
        toggleGPStracking={toggleGPStracking}
        isGPSTracking={isGPSTracking}
        isDisabled={isDisabled}
        infoText={infoText}
        isAreaShape={isAreaShape}
      />
      <Main
        sample={sample}
        isGPSTracking={isGPSTracking}
        setLocation={setLocation}
        isDisabled={isDisabled}
        onCreateSite={onCreateSite}
        onSelectSite={onSelectSite}
        isFetchingLocations={locations.isSynchronising}
      />
      <NewLocationModal
        ref={modal}
        presentingElement={presentingElement}
        isOpen={isNewLocationModalOpen}
        onCancel={onCloseLocationModal}
        onSave={onSaveNewLocation}
        shape={location.shape}
      />
    </IonPage>
  );
};

export default observer(AreaController);
