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
import { expandOutline } from 'ionicons/icons';
import { Main, useOnBackButton } from '@flumens';
import { Trans as T } from 'react-i18next';
import ImageWithBackground from 'Components/ImageWithBackground';
import FullScreenPhotoViewer from '../FullScreenPhotoViewer';
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

  useOnBackButton(onRecord);

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
          <IonIcon src={expandOutline} slot="end" color="warning" />
        </div>
      </div>
    );
  };

  if (!species) {
    return null;
  }

  const onGalleryClose = () => {
    setShowGallery(undefined);
    setShowLifechart(false);
    setShowMap(false);
  };

  return (
    <>
      <FullScreenPhotoViewer
        species={species}
        onClose={onGalleryClose}
        showGallery={showGallery}
        showLifechart={showLifechart}
        showMap={showMap}
      />

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
                    <IonIcon src={expandOutline} slot="end" color="warning" />
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
