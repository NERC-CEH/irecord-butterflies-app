import { observer } from 'mobx-react';
import { cropOutline } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/react';
import Media from 'models/image';
import SpeciesSuggestions from './SpeciesSuggestions';
import './styles.scss';

interface Props {
  onCrop: any;
  image: Media;
  identifyImage?: any;
}

const ImageFooter = ({ onCrop, image, identifyImage }: Props) => {
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
      Crop/Zoom
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
