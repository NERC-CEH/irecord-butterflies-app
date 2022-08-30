/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FC } from 'react';
import { IonIcon, IonButton, IonSpinner } from '@ionic/react';
import { observer } from 'mobx-react';
import { alertCircleOutline, close } from 'ionicons/icons';
import ProbabilityBadge from 'common/Components/ProbabilityBadge';
import Media from 'models/image';

type Props = {
  media: Media;
  isDisabled: boolean;
  onDelete: any;
  onClick: any;
};

const Image: FC<Props> = ({ media, isDisabled, onDelete, onClick }) => {
  const hasBeenIdentified = !!media.attrs?.species;

  const hasMatchParent = media.getIdentifiedTaxonThatMatchParent();

  const isSpeciesSelected = media?.parent?.attrs?.taxon;

  const species = isSpeciesSelected
    ? media.getIdentifiedTaxonThatMatchParent()
    : media.getTopSpecies();

  const showLoading = media.identification.identifying;

  const selectedSpeciesNotMatchingParent = isSpeciesSelected && !hasMatchParent;

  const { probability } = species || {};

  return (
    <div className="img">
      {!isDisabled && (
        <IonButton fill="clear" class="delete" onClick={onDelete}>
          <IonIcon icon={close} />
        </IonButton>
      )}
      <img src={media.attrs.thumbnail} onClick={onClick} />

      {showLoading && <IonSpinner slot="end" className="identifying" />}

      {!showLoading &&
        hasBeenIdentified &&
        !selectedSpeciesNotMatchingParent && (
          <ProbabilityBadge probability={probability} />
        )}

      {!showLoading &&
        hasBeenIdentified &&
        selectedSpeciesNotMatchingParent && (
          <IonIcon className="warning-icon" icon={alertCircleOutline} />
        )}
    </div>
  );
};

export default observer(Image);
