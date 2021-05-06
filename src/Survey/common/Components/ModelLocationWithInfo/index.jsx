import React, { useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { ModelLocation, alert } from '@apps';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import { locateOutline } from 'ionicons/icons';
import config from 'common/config';
import './styles.scss';

function showLocationGPSTip() {
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
  const showLocationGPSTipOnce = () => {
    if (appModel.attrs.showLocationGPSTip) {
      appModel.attrs.showLocationGPSTip = false; // eslint-disable-line

      appModel.save();
      showLocationGPSTip();
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
      namePlaceholder="Site name e.g. nearest village"
      onGPSClick={ModelLocation.utils.onGPSClick}
    />
  );
};

export default ModelLocationWithInfo;
