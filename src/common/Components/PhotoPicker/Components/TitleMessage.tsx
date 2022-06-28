import { FC } from 'react';
import Media from 'models/image';
import { IonLabel } from '@ionic/react';

type Props = {
  image: Media;
};

const TitleMessage: FC<Props> = ({ image }) => {
  const identifierWasNotUsed = !image.attrs.species;
  if (identifierWasNotUsed) return null;

  const doesTaxonMatchParent = image.doesTaxonMatchParent();
  const identifierFoundNoSpecies = !image.attrs?.species?.length;

  const showLoading = image.identification.identifying;
  if (showLoading) return null;

  if (identifierFoundNoSpecies) {
    return (
      <IonLabel className="gallery-ai-message">
        <b>Warning</b> - we could not identify this species.
      </IonLabel>
    );
  }

  const {
    default_common_name,
    taxon,
    probability: prob,
  } = image.getTopSpecies();

  // eslint-disable-next-line
  const taxonName = default_common_name || taxon;
  const probability = ((prob || 0) * 100).toFixed(0);

  if (!doesTaxonMatchParent) {
    return (
      <IonLabel className="gallery-ai-message">
        <b>Warning</b> - we think it is <b className="light">{probability}%</b>{' '}
        likely a <b className="light">{taxonName}</b> species.
      </IonLabel>
    );
  }

  return (
    <IonLabel className="gallery-ai-message success">
      <b>Success</b> - we think it is <b className="light">{probability}%</b>{' '}
      likely a <b className="light">{taxonName}</b> species.
    </IonLabel>
  );
};

export default TitleMessage;
