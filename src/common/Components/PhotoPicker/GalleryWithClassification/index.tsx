import { observer } from 'mobx-react';
import { Gallery, useToast } from '@flumens';
import Media from 'models/image';
import { useUserStatusCheck } from 'models/user';
import ImageFooter from './ImageFooter';
import ImageTitle from './ImageTitle';
import './styles.scss';

type Props = {
  items: Media[];
  showGallery: number;
  onClose: () => boolean;
  onCrop: any;
};

const Footer = ({ children }: any) => (
  <div className="footer-container">{children}</div>
);

const GalleryComponent = ({ items, showGallery, onClose, onCrop }: Props) => {
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();

  const getItem = (image: Media) => {
    const identifyImage = async () => {
      onClose();

      const isUserOK = await checkUserStatus();
      if (!isUserOK) return;

      image.identify().catch(toast.error);
    };

    return {
      src: image.getURL(),
      footer: (
        <ImageFooter
          image={image}
          identifyImage={identifyImage}
          onCrop={onCrop}
        />
      ),
      title: <ImageTitle image={image} />,
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
