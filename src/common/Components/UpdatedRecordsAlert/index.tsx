import { FC, useEffect, useState, useContext } from 'react';
import { useAlert } from '@flumens';
import { AppModel } from 'models/app';
import { observer } from 'mobx-react';
import { NavContext } from '@ionic/react';
import Message from './Message';

let isPopupVisible = false;

interface Props {
  appModel: AppModel;
}

const UpdatedRecordsDialog: FC<Props> = ({ appModel }) => {
  const alert = useAlert();
  const { navigate } = useContext(NavContext);
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
          cssClass: 'secondary',
          role: 'cancel',

          handler: () => {
            isPopupVisible = false;
            appModel.save();
          },
        },
        {
          text: 'See records',
          cssClass: 'primary',
          role: 'ok',

          handler: () => {
            isPopupVisible = false;
            appModel.save();
            navigate('/home/surveys/uploaded', 'none', 'replace');
          },
        },
      ],
    });
  };

  useEffect(showAlert, [verifiedRecordsTimestamp]);

  return null;
};

export default observer(UpdatedRecordsDialog);
