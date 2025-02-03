/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { observer } from 'mobx-react';
import { alertCircleOutline, close } from 'ionicons/icons';
import { IonIcon, IonButton, IonSpinner } from '@ionic/react';
import ProbabilityBadge from 'common/Components/ProbabilityBadge';
import Occurrence from 'common/models/occurrence';
import Media from 'models/image';

type Props = {
  media: Media;
  isDisabled: boolean;
  onDelete: any;
  onClick: any;
};

const Image = ({ media, isDisabled, onDelete, onClick }: Props) => {
  const hasBeenIdentified = !!media.attrs?.species;

  const hasMatchParent = media.getIdentifiedTaxonThatMatchParent();

  const isSpeciesSelected = (media?.parent as Occurrence)?.attrs?.taxon;

  const species = isSpeciesSelected
    ? media.getIdentifiedTaxonThatMatchParent()
    : media.getTopSpecies();

  const showLoading = media.identification.identifying;

  const selectedSpeciesNotMatchingParent = isSpeciesSelected && !hasMatchParent;

  const { probability } = species || {};

  return (
    <div className="img">
      {!isDisabled && (
        <IonButton fill="clear" className="delete" onClick={onDelete}>
          <IonIcon icon={close} />
        </IonButton>
      )}
      <img src={media.getURL()} onClick={onClick} />

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
