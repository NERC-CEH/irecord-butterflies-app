/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FC } from 'react';
import { IonIcon, IonButton, IonSpinner } from '@ionic/react';
import { observer } from 'mobx-react';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  close,
} from 'ionicons/icons';
import Media from 'models/image';

type Props = {
  media: Media;
  isDisabled: boolean;
  onDelete: any;
  onClick: any;
};

const Image: FC<Props> = ({ media, isDisabled, onDelete, onClick }) => {
  const hasBeenIdentified = !!media.attrs?.species?.length;

  const showWarning = !media.doesTaxonMatchParent();

  const showSuccess = media.doesTaxonMatchParent();

  const showLoading = media.identification.identifying;

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

      {!showLoading && hasBeenIdentified && showWarning && (
        <IonIcon className="warning-icon" icon={alertCircleOutline} />
      )}

      {!showLoading && hasBeenIdentified && showSuccess && (
        <IonIcon className="success-icon" icon={checkmarkCircleOutline} />
      )}
    </div>
  );
};

export default observer(Image);