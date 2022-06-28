import { FC } from 'react';
import Media from 'models/image';
import { isPlatform, IonLabel, IonButton } from '@ionic/react';
import '../styles.scss';

const POSITIVE_THRESHOLD = 0.7;
const POSSIBLE_THRESHOLD = 0.2;

type Props = {
  image: Media;
  identifyImage: () => void;
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

  return (
    <div key={index} className="species-tile">
      <div className={`score ${color}`}>
        <IonLabel>{roundedProbability}%</IonLabel>
      </div>
      <div className="container">
        <img className="thumbnail" src={thumbnailSrc} />
        {thumbnailBackground && (
          <img className="thumbnail-background" src={thumbnailBackground} />
        )}
        {!thumbnailBackground && (
          <div className="thumbnail-background">
            <img src={thumbnailSrc} />
          </div>
        )}
        <IonLabel>{commonName}</IonLabel>
      </div>
    </div>
  );
};

const FooterMessage: FC<Props> = ({ image, identifyImage }) => {
  const identifierWasNotUsed = !image.attrs.species;
  const speciesList = image.attrs.species;

  if (identifierWasNotUsed) {
    return (
      <IonButton
        className="re-identify-button"
        fill="clear"
        size="small"
        onClick={identifyImage}
      >
        ID help
      </IonButton>
    );
  }
  const identifierFoundNoSpecies = !image.attrs?.species?.length;
  if (identifierFoundNoSpecies) return null;

  const getIdentifiedSpeciesList = () => {
    const placeholderCount = isPlatform('tablet') ? 3 : 2;

    const getImageItem = (sp: any, index: number) => {
      if (!sp) return <div key={index} className="img-placeholder" />;

      return <SpeciesTile sp={sp} key={index} />;
    };

    const imagesWithPlaceholders = [...speciesList];
    // +1 for the actual image
    if (imagesWithPlaceholders.length < placeholderCount + 1) {
      imagesWithPlaceholders.push(
        ...Array(placeholderCount + 1 - speciesList.length)
      );
    }

    return imagesWithPlaceholders.map(getImageItem);
  };

  if (!speciesList.length) return null;

  return (
    <div id="footer-container">
      <h3>Possibility:</h3>
      <div className="species-array">{getIdentifiedSpeciesList()}</div>
    </div>
  );
};

export default FooterMessage;
