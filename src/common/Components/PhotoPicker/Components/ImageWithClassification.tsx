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
import Badge from 'common/Components/Badge';

type Props = {
  media: Media;
  isDisabled: boolean;
  onDelete: any;
  onClick: any;
};

const Image: FC<Props> = ({ media, isDisabled, onDelete, onClick }) => {
  const hasBeenIdentified = !!media.attrs?.species;

  const hasSpeciesSelected = !!media?.parent?.attrs?.taxon;

  const hasMatchParent = media.doesTaxonMatchParent();

  const species = media.getTopSpecies();

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

      {!showLoading && hasBeenIdentified && !hasSpeciesSelected && (
        <Badge className="badge" species={species} />
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
