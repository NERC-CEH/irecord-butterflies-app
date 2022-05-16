import React, { FC, useEffect, useState } from 'react';
import { useAlert } from '@apps';
import AppModelProps from 'models/app';
import Message from './Message';

let isPopupVisible = false;

interface Props {
  appModel: typeof AppModelProps;
}

const UpdatedRecordsDialog: FC<Props> = ({ appModel }) => {
  const alert = useAlert();
  const [initialised, setInitialised] = useState<boolean>(false);

  const { verifiedRecordsTimestamp, showVerifiedRecordsNotification } =
    appModel.attrs;

  const showAlert = () => {
    if (!showVerifiedRecordsNotification || isPopupVisible) return;

    if (!initialised) {
      // skip first time component is loading, only show on timestamp change
      setInitialised(true);
      return;
    }

    isPopupVisible = true;

    alert({
      header: 'New verified records',
      message: <Message appModel={appModel} />,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
          role: 'cancel',

          handler: () => {
            isPopupVisible = false;
            appModel.save();
          },
        },
      ],
    });
  };

  useEffect(showAlert, [verifiedRecordsTimestamp]);

  return null;
};

export default UpdatedRecordsDialog;
