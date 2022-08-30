import { FC } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { cropOutline } from 'ionicons/icons';
import Media from 'models/image';
import { observer } from 'mobx-react';
import SpeciesSuggestions from './SpeciesSuggestions';
import './styles.scss';

interface Props {
  onCrop: any;
  image: Media;
  identifyImage?: any;
}

const ImageFooter: FC<Props> = ({ onCrop, image, identifyImage }) => {
  const onCropWrap = () => onCrop(image);

  const allowToEdit =
    !image.parent?.isDisabled() && !image.identification.identifying;

  const cropButton = (
    <IonButton
      className="crop-button"
      onClick={onCropWrap}
      fill="clear"
      color="light"
    >
      <IonIcon icon={cropOutline} />
      Crop
    </IonButton>
  );

  return (
    <>
      <SpeciesSuggestions image={image} identifyImage={identifyImage} />

      {allowToEdit && cropButton}
    </>
  );
};

export default observer(ImageFooter);
