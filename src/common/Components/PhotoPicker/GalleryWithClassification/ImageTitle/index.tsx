/* eslint-disable camelcase */
import { FC } from 'react';
import Media from 'models/image';
import { IonLabel, IonNote, isPlatform } from '@ionic/react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import './styles.scss';

type Props = {
  image: Media;
};

const ImageTitle: FC<Props> = ({ image }) => {
  if (image.identification.identifying) return null; // for re-rendering, this line must be first because this is the only observable in the media model

  const identifierWasNotUsed = !image.attrs.species;
  if (identifierWasNotUsed) return null;

  const doesTaxonMatchParent = image.getIdentifiedTaxonThatMatchParent();
  const identifierFoundNoSpecies = !image.attrs?.species?.length;

  let message;
  if (identifierFoundNoSpecies) {
    message = (
      <IonLabel className="gallery-ai-message">
        Sorry, we could not identify this species.
        <IonNote className="better-image-tip">
          Make sure that your species is in the centre of the image and is in
          focus.
        </IonNote>
      </IonLabel>
    );
  } else {
    const { common_name, taxon, probability: prob } = image.getTopSpecies();

    const taxonName = common_name || taxon;
    const probability = ((prob || 0) * 100).toFixed(0);

    if (!doesTaxonMatchParent) {
      message = (
        <IonLabel className="gallery-ai-message">
          <b>Please check</b> - we think it is{' '}
          <b className="light">{probability}%</b> likely to be{' '}
          <b className="light">{taxonName}</b>.
        </IonLabel>
      );
    } else {
      message = (
        <IonLabel className="gallery-ai-message success">
          <b>Great!</b> We also think it is{' '}
          <b className="light">{probability}%</b> likely to be{' '}
          <b className="light">{taxonName}</b>.
        </IonLabel>
      );
    }
  }

  return (
    <div className={clsx(isPlatform('tablet') && 'gallery-tablet-styles')}>
      {message}
    </div>
  );
};

export default observer(ImageTitle);
