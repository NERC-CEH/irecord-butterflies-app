import { FC } from 'react';
import { Gallery } from '@flumens';
import { useUserStatusCheck } from 'models/user';
import Media from 'models/image';
import { observer } from 'mobx-react';
import TitleMessage from './TitleMessage';
import FooterMessage from './FooterMessage';
import '../styles.scss';

type Props = {
  items: Media[];
  showGallery: number;
  onClose: () => boolean;
};

const GalleryComponent: FC<Props> = ({ items, showGallery, onClose }) => {
  const checkUserStatus = useUserStatusCheck();

  const getItem = (image: Media) => {
    const identifyImage = async () => {
      const isUserOK = await checkUserStatus();
      if (!isUserOK) return;
      onClose();
      await image.identify();
    };

    return {
      src: image.getURL(),
      footer: <FooterMessage image={image} identifyImage={identifyImage} />,
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
