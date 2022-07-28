import { FC } from 'react';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { Page, locationToGrid } from '@flumens';
import Header from './Header';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
};

const AreaController: FC<Props> = ({ sample }) => {
  const toggleGPStracking = (on: boolean) => sample.toggleBackgroundGPS(on);

  const setAreaLocation = (shape: number) => sample.setAreaLocation(shape);

  const location = sample.attrs.location || {};
  const isGPSTracking = sample.isBackgroundGPSRunning();
  const { area } = location;
  location.gridref = locationToGrid(location); // eslint-disable-line

  let areaPretty;
  if (area) {
    areaPretty = `${'Selected area'}: ${area.toLocaleString()} m²`;
  } else {
    areaPretty = 'Please draw your area on the map';
  }

  const isDisabled = !!sample.metadata.synced_on;
  const isFinished = !!sample.metadata.saved;

  return (
    <Page id="species-count-area">
      <Header
        toggleGPStracking={toggleGPStracking}
        isGPSTracking={isGPSTracking}
        isFinished={isFinished}
      />
      <Main
        sample={sample}
        areaPretty={areaPretty}
        isGPSTracking={isGPSTracking}
        shape={location.shape}
        setAreaLocation={setAreaLocation}
        isDisabled={isDisabled}
      />
    </Page>
  );
};

export default observer(AreaController);
