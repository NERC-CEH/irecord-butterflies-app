import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Header, MenuAttrToggle, useAlert } from '@apps';
import './styles.scss';

type Props = {
  toggleGPStracking: (state: boolean) => void;
  isGPSTracking: boolean;
  isFinished: boolean;
};

const HeaderComponent: FC<Props> = ({
  isGPSTracking,
  toggleGPStracking,
  isFinished,
}) => {
  const [id, rerender] = useState(0);
  const alert = useAlert();

  const onToggle = (on: boolean) => {
    if (on === isGPSTracking) {
      return;
    }

    if (isGPSTracking && !on) {
      alert({
        header: 'Warning',
        message: 'Are you sure you want to turn off the GPS tracking?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => rerender(id + 1),
          },
          {
            text: 'Turn off',
            cssClass: 'secondary',
            handler: () => toggleGPStracking(false),
          },
        ],
      });
      return;
    }

    toggleGPStracking(on);
  };

  const GPSToggle = (
    <MenuAttrToggle
      label="GPS"
      className="survey-gps-toggle"
      value={isGPSTracking}
      onChange={onToggle}
      disabled={isFinished}
    />
  );

  return <Header title="Area" rightSlot={GPSToggle} />;
};

export default observer(HeaderComponent);
