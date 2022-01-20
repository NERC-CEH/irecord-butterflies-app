import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { IonLabel } from '@ionic/react';
import { Header, Toggle, alert } from '@apps';
import './styles.scss';

type Props = {
  toggleGPStracking: (state: boolean) => void;
  isGPSTracking: boolean;
  isDisabled: boolean;
};

const HeaderComponent: FC<Props> = ({
  isGPSTracking,
  toggleGPStracking,
  isDisabled,
}) => {
  const [id, rerender] = useState(0);

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
    <>
      <IonLabel>GPS</IonLabel>
      <Toggle
        className="survey-gps-toggle"
        color="success"
        checked={isGPSTracking}
        onToggle={onToggle}
      />
    </>
  );

  return <Header title="Area" rightSlot={!isDisabled && GPSToggle} />;
};

export default observer(HeaderComponent);
