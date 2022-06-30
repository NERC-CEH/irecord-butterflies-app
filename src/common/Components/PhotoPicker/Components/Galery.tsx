import { FC } from 'react';
import { Gallery, device, useToast } from '@flumens';
import Media from 'models/image';
import { isPlatform } from '@ionic/react';
import clsx from 'clsx';
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

const Footer = ({ children }: any) => {
  const speciesHasNotBeenIdentifiedOrNotFound =
    children?.props?.image?.attrs?.species?.length;

  if (!speciesHasNotBeenIdentifiedOrNotFound)
    return <div className="footer">{children}</div>;

  return (
    <div className="footer-container">
      <h3>Possible:</h3>
      {children}
    </div>
  );
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

      image.identify().catch(toast.error);
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
      title: (
        <div className={clsx(isPlatform('tablet') && 'gallery-tablet-styles')}>
          <TitleMessage image={image} />
        </div>
      ),
    };
  };

  return (
    <Gallery
      isOpen={Number.isFinite(showGallery)}
      items={items.map(getItem)}
      initialSlide={showGallery}
      onClose={onClose}
      Footer={Footer}
    />
  );
};

export default observer(GalleryComponent);
