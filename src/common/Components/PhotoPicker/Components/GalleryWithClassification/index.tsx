import { FC } from 'react';
import { Gallery, useToast } from '@flumens';
import Media from 'models/image';
import { useUserStatusCheck } from 'models/user';
import { isPlatform } from '@ionic/react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import TitleMessage from './TitleMessage';
import FooterMessage from './FooterMessage';
import './styles.scss';

type Props = {
  items: Media[];
  showGallery: number;
  onClose: () => boolean;
};

const Footer = ({ children }: any) => {
  const speciesHasNotBeenIdentifiedOrNotFound =
    children?.props?.image?.attrs?.species?.length;

  if (!speciesHasNotBeenIdentifiedOrNotFound) return children;

  return (
    <div className="footer-container">
      <h3>Suggestions:</h3>
      {children}
    </div>
  );
};

const GalleryComponent: FC<Props> = ({ items, showGallery, onClose }) => {
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();

  const getItem = (image: Media) => {
    const identifyImage = async () => {
      onClose();

      const isUserOK = await checkUserStatus();
      if (!isUserOK) {
        return;
      }

      image.identify().catch(toast.error);
    };

    return {
      src: image.getURL(),
      footer: <FooterMessage image={image} identifyImage={identifyImage} />,
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
