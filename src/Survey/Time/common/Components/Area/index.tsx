import { useRef } from 'react';
import { observer } from 'mobx-react';
import { resizeOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { IonIcon, IonPage } from '@ionic/react';
import { useSample } from 'common/flumens';
import Sample from 'models/sample';
import Header from './Header';
import Main from './Main';
import './styles.scss';

const AreaController = () => {
  const { sample } = useSample<Sample>();

  const toggleGPStracking = (on: boolean) => {
    sample!.toggleBackgroundGPS(on);
  };

  const setLocation = (shape: any) => {
    sample!.setAreaLocation(shape);
  };

  const location = (sample!.data.location as any) || {};
  const isGPSTracking = sample!.isGPSRunning();
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

  const isAreaShape = location.shape?.type === 'Polygon';

  const page = useRef(null);

  if (!sample) return null;

  const { isDisabled } = sample;

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
      />
    </IonPage>
  );
};

export default observer(AreaController);
