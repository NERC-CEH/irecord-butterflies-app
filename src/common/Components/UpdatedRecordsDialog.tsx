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
      <p>
        Some of your records have been verified. Please check your records list.
      </p>
      <IonItem lines="none" className="updated-records-dialog alert-message">
        <IonCheckbox slot="start" checked={false} onIonChange={toggleMessage} />
        <IonLabel>Do not show again</IonLabel>
      </IonItem>
    </>
  );
};

export default UpdatedRecordsDialog;
