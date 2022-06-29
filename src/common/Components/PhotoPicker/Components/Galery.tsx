import { FC } from 'react';
import { Gallery, device, useToast } from '@flumens';
import Media from 'models/image';
import { observer } from 'mobx-react';
import TitleMessage from './TitleMessage';
import FooterMessage from './FooterMessage';
import '../styles.scss';

type Props = {
  items: Media[];
  showGallery: number;
  onClose: () => boolean;
  useSpeciesImageClassifier: boolean;
  isLoggedIn: boolean;
};

const GalleryComponent: FC<Props> = ({
  items,
  showGallery,
  onClose,
  useSpeciesImageClassifier,
  isLoggedIn,
}) => {
  const toast = useToast();

  const getItem = (image: Media) => {
    const identifyImage = async () => {
      if (!device.isOnline) {
        toast.warn('Looks like you are offline!');
        return;
      }

      if (!isLoggedIn) {
        toast.warn('Please login!');
        return;
      }

      onClose();
      if (!isLoggedIn && !device.isOnline && !useSpeciesImageClassifier) return;

      await image.identify();
    };

    return {
      src: image.getURL(),
      footer: (
        <FooterMessage
          useSpeciesImageClassifier={useSpeciesImageClassifier}
          image={image}
          identifyImage={identifyImage}
        />
      ),
      title: <TitleMessage image={image} />,
    };
  };

  return (
    <Gallery
      isOpen={Number.isFinite(showGallery)}
      items={items.map(getItem)}
      initialSlide={showGallery}
      onClose={onClose}
    />
  );
};

export default observer(GalleryComponent);
