import { FC } from 'react';
import Media from 'models/image';
import { isPlatform, IonLabel, IonButton } from '@ionic/react';

const POSITIVE_THRESHOLD = 0.7;
const POSSIBLE_THRESHOLD = 0.2;

type Props = {
  image: Media;
  identifyImage?: any;
};

const SpeciesTile = ({ sp, index }: any) => {
  const {
    common_name: commonName,
    thumbnail: thumbnailSrc,
    thumbnailBackground,
    probability,
  } = sp;

  let color;
  if (probability > POSITIVE_THRESHOLD) {
    color = 'success';
  } else if (probability > POSSIBLE_THRESHOLD) {
    color = 'warning';
  } else {
    color = 'danger';
  }
  const roundedProbability = (probability * 100).toFixed();

  const isTablet = isPlatform('tablet') ? 'tablet' : '';

  return (
    <div key={index} className={`species-tile ${isTablet}`}>
      <div className={`score ${color}`}>
        <IonLabel>{roundedProbability}%</IonLabel>
      </div>
      <div className="container">
        <img className="species-thumbnail" src={thumbnailSrc} />
        {thumbnailBackground && (
          <img
            className="species-thumbnail-background"
            src={thumbnailBackground}
          />
        )}
        {!thumbnailBackground && (
          <div className="species-thumbnail-background">
            <img src={thumbnailSrc} />
          </div>
        )}
        <IonLabel>{commonName}</IonLabel>
      </div>
    </div>
  );
};

const FooterMessage: FC<Props> = ({ image, identifyImage }) => {
  const identifierWasNotUsed = !image.attrs?.species;
  const speciesList = image.attrs?.species;

  if (identifierWasNotUsed) {
    return (
      <div className="footer">
        <IonButton
          className="re-identify-button"
          fill="clear"
          size="small"
          onClick={identifyImage}
        >
          Get species suggestions
        </IonButton>
      </div>
    );
  }

  const identifierFoundNoSpecies = !image.attrs?.species?.length;
  if (identifierFoundNoSpecies) return null;

  const getIdentifiedSpeciesList = () => {
    const placeholderCount = isPlatform('tablet') ? 4 : 3;

    const getImageItem = (sp: any, index: number) => {
      if (!sp) return <div key={index} className="img-placeholder" />;

      return <SpeciesTile sp={sp} key={index} />;
    };

    const imagesWithPlaceholders = [...speciesList];
    // +1 for the actual image
    if (imagesWithPlaceholders.length < placeholderCount) {
      imagesWithPlaceholders.push(
        ...Array(placeholderCount - speciesList.length)
      );
    }

    return imagesWithPlaceholders.map(getImageItem);
  };

  if (!speciesList.length) return null;

  return (
    <div className="species-array-wrapper">
      <div className="species-array">{getIdentifiedSpeciesList()}</div>
    </div>
  );
};

export default FooterMessage;
