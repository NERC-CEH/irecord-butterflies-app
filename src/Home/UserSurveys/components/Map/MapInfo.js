import React from 'react';
import { useMap } from 'react-leaflet';
import { withIonLifeCycle, IonIcon, NavContext } from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import GPS from 'helpers/BackgroundGPS';
import L from 'leaflet';
import MapControl from 'common/Components/LeafletControl';

const DEFAULT_POSITION = [55, -3.09];
const DEFAULT_LOCATED_ZOOM = 18;

class MapInfo extends React.Component {
  static contextType = NavContext;

  state = {
    locating: false,
  };

  ionViewDidEnter = () => {
    this._leaving = false;

    const { map } = this.props;

    const refreshMap = () => {
      map.invalidateSize();
    };

    map.whenReady(refreshMap);
  };

  componentWillUnmount() {
    if (this.state.locating) {
      this.stopGPS();
    }
  }

  stopGPS = () => {
    GPS.stop(this.state.locating);
    this.setState({ locating: false });
  };

  startGPS = () => {
    const startGPS = (resolve, reject) => {
      const onPosition = (error, location) => {
        this.stopGPS();

        if (error) {
          reject(error);
          return;
        }

        resolve(location);
      };

      const locatingJobId = GPS.start(onPosition);
      this.setState({ locating: locatingJobId });
    };

    return new Promise(startGPS);
  };

  onGeolocate = async () => {
    if (this.state.locating) {
      this.stopGPS();
      return;
    }
    const location = await this.startGPS();
    const { map } = this.props;

    map.setView(
      new L.LatLng(location.latitude, location.longitude),
      DEFAULT_LOCATED_ZOOM
    );
  };

  render() {
    return (
      <MapControl position="topleft">
        <button
          className={`geolocate-btn ${this.state.locating ? 'spin' : ''}`}
          onClick={this.onGeolocate}
        >
          <IonIcon icon={locateOutline} mode="md" size="large" />
        </button>
      </MapControl>
    );
  }
}

function withMap(Component) {
  return function WrappedComponent(props) {
    const map = useMap();
    return <Component {...props} map={map} />;
  };
}

export default withMap(withIonLifeCycle(MapInfo));