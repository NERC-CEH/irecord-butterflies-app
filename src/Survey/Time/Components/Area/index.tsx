import React, { FC } from 'react';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { Page } from '@apps';
import Header from './Header';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: typeof Sample;
};

const AreaController: FC<Props> = ({ sample }) => {
  const toggleGPStracking = (on: boolean) => sample.toggleGPStracking(on);

  const setAreaLocation = (shape: number) => sample.setAreaLocation(shape);

  const location = sample.attrs.location || {};
  const isGPSTracking = sample.isGPSRunning();
  const { area } = location;

  let areaPretty;
  if (area) {
    areaPretty = `${'Selected area'}: ${area.toLocaleString()} m²`;
  } else {
    areaPretty = 'Please draw your area on the map';
  }

  const isDisabled = !!sample.metadata.synced_on;

  return (
    <Page id="single-species-count-area">
      <Header
        toggleGPStracking={toggleGPStracking}
        isGPSTracking={isGPSTracking}
        isDisabled={isDisabled}
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
