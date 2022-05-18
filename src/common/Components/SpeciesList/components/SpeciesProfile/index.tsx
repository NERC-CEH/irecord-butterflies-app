/* eslint-disable @getify/proper-arrows/name */
import { FC, useState } from 'react';
import {
  IonCardHeader,
  IonButton,
  IonCardContent,
  IonIcon,
  IonChip,
} from '@ionic/react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '@ionic/react/css/ionic-swiper.css';
import clsx from 'clsx';
import { expandOutline } from 'ionicons/icons';
import { Main, Gallery } from '@apps';
import { Trans as T } from 'react-i18next';
import ImageWithBackground from 'Components/ImageWithBackground';
import './styles.scss';

type Image = { file: string; title: string; author: string };

type Props = {
  onRecord: any;
  species?: any;
  isSurvey?: boolean;
};

const SpeciesProfile: FC<Props> = ({ species, onRecord, isSurvey }) => {
  const [showGallery, setShowGallery] = useState<number>();
  const [showLifechart, setShowLifechart] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const getFullScreenPhotoViewer = () => {
    let items = [];
    let initialSlide = 0;
    let className = 'white-background';
    let pageTitle = '';

    const swiperProps: any = {};

    const onGalleryClose = () => {
      setShowGallery(undefined);
      setShowLifechart(false);
      setShowMap(false);
    };

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
            <img
              src={species.lifechart}
              style={{ transform: 'rotate(90deg)' }}
            />
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
        onClose={onGalleryClose}
        className={clsx('species-profile-gallery', className)}
        title={pageTitle}
        mode="md"
        swiperProps={swiperProps}
      />
    );
  };

  const showPhotoInFullScreen = (index: number) => setShowGallery(index);

  const showshowLifechartInFullScreen = () => setShowLifechart(true);

  const showMapInFullScreen = () => setShowMap(true);

  const getSlides = () => {
    const { images } = species;

    const slideOpts = {
      initialSlide: 0,
      speed: 400,
    };

    const getSlide = (image: Image, index: number) => {
      const { file, title } = image;
      const showPhotoInFullScreenWrap = () => showPhotoInFullScreen(index);
      const imageURL = `/images/${file}.jpg`;

      return (
        <SwiperSlide
          key={imageURL}
          onClick={showPhotoInFullScreenWrap}
          className="species-profile-photo"
        >
          <ImageWithBackground src={imageURL} />
          {!!title && <div className="title">{title}</div>}
        </SwiperSlide>
      );
    };

    const slideImage = images.map(getSlide);

    return (
      <Swiper modules={[Pagination]} pagination {...slideOpts}>
        {slideImage}
      </Swiper>
    );
  };

  const getMap = () => {
    if (!species.map) {
      return <p>Sorry, this species doesn't have a map.</p>;
    }

    return (
      <div className="fullscreen-tappable map" onClick={showMapInFullScreen}>
        <img src={species.map} />
        <div className="fullscreen-btn">
          <IonIcon src={expandOutline} slot="end" color="secondary" />
        </div>
      </div>
    );
  };

  if (!species) {
    return null;
  }

  return (
    <>
      {getFullScreenPhotoViewer()}

      <Main id="species-profile" className="ion-padding">
        {getSlides()}

        <IonCardHeader>
          <div className="title">
            <h1>{species.commonName}</h1>
            <h3>
              <i>{species.scientificName}</i>
            </h3>
          </div>
          {!isSurvey && (
            <IonButton
              shape="round"
              onClick={onRecord}
              routerLink={`/survey/point?species=${species.id}`}
            >
              Record
            </IonButton>
          )}
        </IonCardHeader>

        <IonCardContent>
          <h3>
            <T>Identification Tips</T>:
          </h3>
          <p>{species.idTips}</p>
          <h3>
            <T>Habitats</T>:
          </h3>
          <p>{species.habitats}</p>
          <h3>
            UK Status:{' '}
            <IonChip className="species-status" outline>
              {species.status}
            </IonChip>
          </h3>
          <p>{species.ukStatus}</p>

          {(species.lifechart || species.whenToSee) && (
            <>
              <h3>
                <T>When to see</T>:
              </h3>
              {species.lifechart && (
                <div
                  className="fullscreen-tappable"
                  onClick={showshowLifechartInFullScreen}
                >
                  <div className="fullscreen-btn">
                    <IonIcon src={expandOutline} slot="end" color="secondary" />
                  </div>
                  <img src={species.lifechart} />
                </div>
              )}

              {species.whenToSee && <p>{species.whenToSee}</p>}
            </>
          )}

          {species.map && (
            <>
              <h3>
                <T>Distribution</T>:
              </h3>
              {getMap()}
            </>
          )}
          {species.webLink && (
            <h3>
              Further Info: <a href={species.webLink}>website</a>
            </h3>
          )}
        </IonCardContent>
      </Main>
    </>
  );
};

export default SpeciesProfile;
