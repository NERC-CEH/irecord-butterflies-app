import { useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { ModelLocation, useAlert } from '@flumens';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import { locateOutline } from 'ionicons/icons';
import config from 'common/config';
import './styles.scss';

function showLocationGPSTip(alert) {
  alert({
    header: 'Geolocate',
    message: (
      <p className="geolocation-tip">
        Tapping <IonIcon src={locateOutline} /> button will centre the map on
        your current location. This may take a little time.
      </p>
    ),
    buttons: [{ text: 'OK, got it' }],
  });
}

const getLocation = sample => sample.attrs.location || {};

const ModelLocationWithInfo = props => {
  const alert = useAlert();

  const showLocationGPSTipOnce = () => {
    if (appModel.attrs.showLocationGPSTip) {
      appModel.attrs.showLocationGPSTip = false; // eslint-disable-line

      appModel.save();
      showLocationGPSTip(alert);
    }
  };

  useEffect(showLocationGPSTipOnce);

  return (
    <ModelLocation
      model={props.sample} // eslint-disable-line
      mapProviderOptions={config.map}
      useGridRef
      useGridMap
      suggestLocations={savedSamples.map(getLocation)}
      onLocationNameChange={ModelLocation.utils.onLocationNameChange}
      namePlaceholder="Site name eg nearby village"
      onGPSClick={ModelLocation.utils.onGPSClick}
      backButtonProps={{ text: 'Back' }}
    />
  );
};

export default ModelLocationWithInfo;
