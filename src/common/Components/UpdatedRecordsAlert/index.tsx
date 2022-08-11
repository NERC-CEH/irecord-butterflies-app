import { FC, useEffect, useContext } from 'react';
import { useAlert } from '@flumens';
import { AppModel } from 'models/app';
import SavedSamplesProps from 'models/savedSamples';
import { observer } from 'mobx-react';
import { NavContext, IonItem, IonCheckbox, IonLabel } from '@ionic/react';
import './styles.scss';

let isPopupVisible = false;

interface Props {
  savedSamples: typeof SavedSamplesProps;
  appModel: AppModel;
}

const UpdatedRecordsDialog: FC<Props> = ({ appModel, savedSamples }) => {
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

  useEffect(showAlert, [savedSamples.verified?.timestamp]);

  return null;
};

export default observer(UpdatedRecordsDialog);
