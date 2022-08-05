/* eslint-disable camelcase */
import { FC } from 'react';
import Media from 'models/image';
import { IonLabel, IonNote } from '@ionic/react';

type Props = {
  image: Media;
};

const TitleMessage: FC<Props> = ({ image }) => {
  const identifierWasNotUsed = !image.attrs.species;
  if (identifierWasNotUsed) return null;

  const doesTaxonMatchParent = image.getIdentifiedTaxonThatMatchParent();
  const identifierFoundNoSpecies = !image.attrs?.species?.length;

  const showLoading = image.identification.identifying;
  if (showLoading) return null;

  if (identifierFoundNoSpecies) {
    return (
      <IonLabel className="gallery-ai-message">
        Sorry, we could not identify this species.
        <IonNote className="better-image-tip">
          Make sure that your species is in the centre of the image and is in
          focus.
        </IonNote>
      </IonLabel>
    );
  }

  const {
    default_common_name,
    taxon,
    probability: prob,
  } = image.getTopSpecies();

  const taxonName = default_common_name || taxon;
  const probability = ((prob || 0) * 100).toFixed(0);

  if (!doesTaxonMatchParent) {
    return (
      <IonLabel className="gallery-ai-message">
        <b>Please check</b> - we think it is{' '}
        <b className="light">{probability}%</b> likely to be{' '}
        <b className="light">{taxonName}</b> species.
      </IonLabel>
    );
  }

  return (
    <IonLabel className="gallery-ai-message success">
      <b>Great!</b> We also think it is <b className="light">{probability}%</b>{' '}
      likely to be <b className="light">{taxonName}</b> species.
    </IonLabel>
  );
};

export default TitleMessage;
