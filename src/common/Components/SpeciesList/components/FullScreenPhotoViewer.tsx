/* eslint-disable @getify/proper-arrows/name */
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/pagination';
import { SwiperSlide } from 'swiper/react';
import { Gallery, useOnHideModal } from '@flumens';
import '@ionic/react/css/ionic-swiper.css';
import { Species } from 'common/data/species';
import '../styles.scss';

type Image = { file: string; title: string; author: string };

type Props = {
  species: Species;
  onClose: () => void;
  showGallery?: number;
  showLifechart: boolean;
  showMap: boolean;
};

const FullScreenPhotoViewer = ({
  species,
  onClose,
  showGallery,
  showLifechart,
  showMap,
}: Props) => {
  let items: any = [];
  let initialSlide = 0;
  let className = 'white-background';
  let pageTitle = '';

  useOnHideModal(onClose);

  const swiperProps: any = {};

  if (Number.isInteger(showGallery)) {
    const getImageSource = ({ file, title, author }: Image) => {
      const imageURL = `/images/${file}.jpg`;
      return { src: imageURL, title, footer: `© ${author}` };
    };

    items = species.images.map(getImageSource);
    initialSlide = showGallery || 0;
    className = '';
  }

  if (showLifechart) {
    pageTitle = 'Lifechart';
    swiperProps.zoom = false;

    const lifechart = (
      <SwiperSlide key={species.lifechart}>
        <div style={{ width: '95vh' }}>
          <img src={species.lifechart} style={{ transform: 'rotate(90deg)' }} />
        </div>
      </SwiperSlide>
    );
    items.push({ item: lifechart });
  }

  if (showMap) {
    pageTitle = 'Distribution';
    items.push({ src: species.map });
  }

  const isOpen =
    !!items.length &&
    (Number.isInteger(showGallery) || showLifechart || showMap);

  return (
    <Gallery
      isOpen={isOpen}
      items={items}
      initialSlide={initialSlide}
      onClose={onClose}
      className={clsx('species-profile-gallery', className)}
      title={pageTitle}
      mode="md"
      swiperProps={swiperProps}
    />
  );
};

export default FullScreenPhotoViewer;
