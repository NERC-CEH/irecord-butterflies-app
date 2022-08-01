/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FC, useEffect, useContext, useState } from 'react';
import { IonIcon, IonButton, IonSpinner, NavContext } from '@ionic/react';
import { useAlert } from '@flumens';
import { observer } from 'mobx-react';
import appModel from 'common/models/app';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  close,
} from 'ionicons/icons';
import Media from 'models/image';
import Badge from 'common/Components/Badge';

type Props = {
  media: Media;
  isDisabled: boolean;
  onDelete: any;
  onClick: any;
};

let isPopupVisible = false;

const Image: FC<Props> = ({ media, isDisabled, onDelete, onClick }) => {
  const alert = useAlert();
  const { navigate } = useContext(NavContext);
  const [initialised, setInitialised] = useState<boolean>(false);

  const hasBeenIdentified = !!media.attrs?.species;

  const hasSpeciesSelected = !!media?.parent?.attrs?.taxon;

  const hasMatchParent = media.doesTaxonMatchParent();

  const showLoading = media.identification.identifying;

  const topSpeciesIsMoth = media?.getTopSpecies()?.type !== 'moth';

  const showAlert = () => {
    if (!initialised) {
      setInitialised(true);
      return;
    }

    isPopupVisible = true;

    const { useMoths, showMothSpeciesTip } = appModel.attrs;

    if (
      !hasBeenIdentified ||
      topSpeciesIsMoth ||
      useMoths ||
      !showMothSpeciesTip
    )
      return;

    appModel.attrs.showMothSpeciesTip = false;
    appModel.save();

    alert({
      header: 'Moth species detected',
      message:
        'You can record selected moth species with this app by visiting the app settings in the Menu and switching on Enable moth species',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
          role: 'cancel',
        },
        {
          text: 'Enable Moth species',
          cssClass: 'primary',

          handler: () => {
            navigate('/settings/menu', 'root');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isPopupVisible = false;
            appModel.save();
          },
        },
      ],
    });
  };

  useEffect(showAlert);

  const onClickWrap = () => !showLoading && onClick();

  return (
    <div className="img">
      {!isDisabled && (
        <IonButton fill="clear" class="delete" onClick={onDelete}>
          <IonIcon icon={close} />
        </IonButton>
      )}
      <img src={media.attrs.thumbnail} onClick={onClickWrap} />

      {showLoading && <IonSpinner slot="end" className="identifying" />}

      {!showLoading && hasBeenIdentified && !hasSpeciesSelected && (
        <Badge className="badge" media={media} />
      )}

      {!showLoading && hasBeenIdentified && !hasMatchParent && (
        <IonIcon className="warning-icon" icon={alertCircleOutline} />
      )}

      {!showLoading && hasBeenIdentified && hasMatchParent && (
        <IonIcon className="success-icon" icon={checkmarkCircleOutline} />
      )}
    </div>
  );
};

export default observer(Image);
