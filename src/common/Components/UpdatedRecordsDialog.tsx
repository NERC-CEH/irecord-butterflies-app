import React, { FC } from 'react';
import AppModelProps from 'models/app';

import { IonItem, IonCheckbox, IonLabel } from '@ionic/react';

interface Props {
  appModel: typeof AppModelProps;
}

const UpdatedRecordsDialog: FC<Props> = ({ appModel }) => {
  const toggleMessage = () => {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showVerifiedRecordsNotification = !appModel.attrs
      .showVerifiedRecordsNotification;
  };

  return (
    <>
      Some of your records have been verified. Please check your records list.
      <IonItem lines="none" className="updated-records-dialog">
        <IonLabel>Do not show again</IonLabel>
        <IonCheckbox slot="start" checked={false} onIonChange={toggleMessage} />
      </IonItem>
    </>
  );
};

export default UpdatedRecordsDialog;
