/* eslint-disable @getify/proper-arrows/name */
import { useState } from 'react';
import { expandOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Badge,
  Button,
  ImageWithBackground,
  Main,
  useOnBackButton,
} from '@flumens';
import { IonCardHeader, IonCardContent, IonIcon } from '@ionic/react';
import FullScreenPhotoViewer from '../FullScreenPhotoViewer';
import './styles.scss';

type Image = { file: string; title: string; author: string };

type Props = {
  onNavBack: any;
  onRecord: any;
  species?: any;
  isSurvey?: boolean;
};

const SpeciesProfile = ({ species, onRecord, onNavBack, isSurvey }: Props) => {
  const [showGallery, setShowGallery] = useState<number>();
  const [showLifechart, setShowLifechart] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useOnBackButton(onNavBack);

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

  if (!species) return null;

  const onGalleryClose = () => {
    setShowGallery(undefined);
    setShowLifechart(false);
    setShowMap(false);
  };

  const onRecordWrap = () => onRecord(species);

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
          <div className="flex items-center justify-between gap-2">
            <div className="title">
              <h1>{species.commonName}</h1>
              <h3 className="font-light">
                <i>{species.scientificName}</i>
              </h3>
            </div>
            {!isSurvey && (
              <Button
                shape="round"
                onPress={onRecordWrap}
                color="primary"
                className="py-2"
              >
                Record
              </Button>
            )}
          </div>
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
            <Badge className="text-xs capitalize" fill="outline">
              {species.status}
            </Badge>
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
