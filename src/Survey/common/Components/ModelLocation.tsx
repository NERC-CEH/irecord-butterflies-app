/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
  MapContainer,
  MapHeader,
  MapSettingsPanel,
  Page,
  Main,
  RadioInput,
  useMapStyles,
  textToLocation,
  mapEventToLocation,
  toggleGPS,
  mapFlyToLocation,
  useSample,
} from '@flumens';
import config from 'common/config';
import samples from 'common/models/collections/samples';
import Sample from 'common/models/sample';

// TODO:
// function showLocationGPSTip(alert) {
//   alert({
//     header: 'Geolocate',
//     message: (
//       <p className="geolocation-tip">
//         Tapping <IonIcon src={locateOutline} /> button will centre the map on
//         your current location. This may take a little time.
//       </p>
//     ),
//     buttons: [{ text: 'OK, got it' }],
//   });
// }

// const getLocation = sample => sample.data.location || {};

// const ModelLocationWithInfo = props => {
//   const alert = useAlert();

//   const showLocationGPSTipOnce = () => {
//     if (appModel.data.showLocationGPSTip) {
//       appModel.data.showLocationGPSTip = false; // eslint-disable-line

//       appModel.save();
//       showLocationGPSTip(alert);
//     }
//   };

//   useEffect(showLocationGPSTipOnce);

const ModelLocation = () => {
  const { sample, subSample } = useSample<Sample>();
  const model = subSample || sample!;

  const location = model.data.location || {};
  const parentLocation = model.parent?.data.location;

  const setLocation = async (newLocation: any) => {
    if (!newLocation) return;
    if (model.isGPSRunning()) model.stopGPS();

    model.data.location = { ...model.data.location, ...newLocation };
  };

  const onManuallyTypedLocationChange = (e: any) =>
    setLocation(textToLocation(e?.target?.value));

  const onLocationNameChange = ({ name }: any) => {
    model.data.location = { ...model.data.location, name };
  };

  const [showSettings, setShowSettings] = useState(false);
  const onCloseSettings = () => setShowSettings(false);
  const onLayersClick = () => setShowSettings(!showSettings);

  const [currentStyle, setCurrentStyle, styles] = useMapStyles();
  const onStyleChange = (newLayer: string) => {
    setCurrentStyle(newLayer);
    setShowSettings(false);
  };

  const onMapClick = (e: any) => setLocation(mapEventToLocation(e));
  const onGPSClick = () => toggleGPS(model);

  const [mapRef, setMapRef] = useState<any>();
  const flyToLocation = () => mapFlyToLocation(mapRef, location);
  useEffect(flyToLocation, [mapRef, location]);

  const getLocation = (smp: Sample) => smp.data.location || {};
  const byLocal = (smp: Sample) => smp.isStored;
  const locationNameSuggestions = samples.filter(byLocal).map(getLocation);

  return (
    <Page id="model-location">
      <MapHeader>
        <MapHeader.Location
          location={location}
          onChange={onManuallyTypedLocationChange}
          useGridRef
          backButtonProps={{ text: 'Back', className: 'pr-2' }}
        />
        <MapHeader.LocationName
          onChange={onLocationNameChange}
          value={location.name}
          placeholder="Site name e.g. nearby village"
          suggestions={locationNameSuggestions}
        />
      </MapHeader>
      <Main className="[--padding-bottom:0px] [--padding-top:0px]">
        <MapContainer
          onReady={setMapRef}
          onClick={onMapClick}
          accessToken={config.map.mapboxApiKey}
          mapStyle={currentStyle}
          maxPitch={0}
          initialViewState={location}
        >
          <MapContainer.Control.Geolocate
            isLocating={model.gps.locating}
            onClick={onGPSClick}
          />

          <MapContainer.Control.Layers onClick={onLayersClick} />
          <MapSettingsPanel isOpen={showSettings} onClose={onCloseSettings}>
            <RadioInput
              options={styles}
              onChange={onStyleChange}
              value={currentStyle}
              className="px-2"
              platform="ios"
            />
          </MapSettingsPanel>

          <MapContainer.OSGBGrid />

          <MapContainer.Marker
            parentGridref={parentLocation?.gridref}
            {...location}
          />
        </MapContainer>
      </Main>
    </Page>
  );
};

export default observer(ModelLocation);
