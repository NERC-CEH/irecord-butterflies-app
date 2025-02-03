import { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { useAlert } from '@flumens';
import { NavContext, IonItem, IonCheckbox, IonLabel } from '@ionic/react';
import appModel from 'models/app';
import savedSamples from 'models/collections/samples';
import './styles.scss';

let isPopupVisible = false;

const UpdatedRecordsDialog = () => {
  const alert = useAlert();
  const { navigate } = useContext(NavContext);

  const { showVerifiedRecordsNotification } = appModel.attrs;

  const onToggleAlert = (e: any) => {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showVerifiedRecordsNotification = !e.detail.checked;
  };

  const showAlert = () => {
    if (!showVerifiedRecordsNotification || isPopupVisible) return;

    const verifiedRecordsCount = savedSamples.verified?.count;
    if (!verifiedRecordsCount) return;

    isPopupVisible = true;

    const message = (
      <>
        <p>
          Some of your records have been verified. Please check your records
          list.
        </p>
        <IonItem lines="none" className="updated-records-dialog alert-message">
          <IonCheckbox
            slot="start"
            checked={false}
            onIonChange={onToggleAlert}
          />
          <IonLabel>
            <small>Do not show again</small>
          </IonLabel>
        </IonItem>
      </>
    );

    alert({
      header: `New verified records (${verifiedRecordsCount})`,
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          cssClass: 'secondary',
          role: 'cancel',

          handler: () => {
            isPopupVisible = false;
          },
        },
        {
          text: 'See records',
          cssClass: 'primary',
          role: 'ok',

          handler: () => {
            isPopupVisible = false;
            navigate('/home/surveys/uploaded', 'none', 'replace');
          },
        },
      ],
    });
  };

  useEffect(showAlert, [savedSamples.verified?.timestamp]);

  return null;
};

export default observer(UpdatedRecordsDialog);
