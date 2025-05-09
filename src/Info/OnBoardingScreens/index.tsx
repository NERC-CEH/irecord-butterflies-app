import { ReactNode, useState } from 'react';
import { observer } from 'mobx-react';
import { arrowForward, checkmarkOutline } from 'ionicons/icons';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Page, Main } from '@flumens';
import {
  IonButton,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonFooter,
} from '@ionic/react';
import appModel from 'models/app';
import brimstone from './images/brimstone.jpg';
import button from './images/button.png';
import fritillary from './images/fritillary.jpg';
import list from './images/list.png';
import peacock from './images/peacock.jpg';
import './styles.scss';

interface Props {
  children: ReactNode;
}

const OnBoardingScreens = ({ children }: Props) => {
  const [moreSlidesExist, setMoreSlidesExist] = useState(true);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperCore>();

  const { showedWelcome } = appModel.data;

  if (showedWelcome) {
    return <>{children}</>; // eslint-disable-line react/jsx-no-useless-fragment
  }

  function exit() {
    // eslint-disable-next-line no-param-reassign
    appModel.data.showedWelcome = true;
  }

  const handleSlideChangeStart = async () => {
    const isEnd = controlledSwiper && controlledSwiper.isEnd;
    setMoreSlidesExist(!isEnd);
  };

  const slideNextOrClose = () => {
    if (moreSlidesExist) {
      controlledSwiper && controlledSwiper.slideNext();
      return;
    }

    exit();
  };

  return (
    <Page id="welcome-page">
      <Main>
        <Swiper
          onSwiper={setControlledSwiper}
          modules={[Pagination]}
          pagination={moreSlidesExist}
          onSlideChange={handleSlideChangeStart}
        >
          <SwiperSlide style={{ backgroundImage: `url(${peacock})` }}>
            <h3 className="app-name">
              iRecord <b>Butterflies</b>
            </h3>
            <div className="message-container">
              <div className="message">
                <p>Identify butterflies that you see.</p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="slide-header">
              <img src={list} alt="list" />
            </div>
            <div className="message-container">
              <h2>What's flying in your area</h2>
              <div className="message">
                <p>
                  To help with identification, species are shown according to
                  what is most likely to be seen in your area at this time of
                  year.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide style={{ backgroundImage: `url(${brimstone})` }}>
            <h3 className="app-name">
              iRecord <b>Butterflies</b>
            </h3>
            <div className="message-container">
              <div className="message">
                <p>Submit and share your sightings through iRecord.</p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="record">
            <div className="slide-header">
              <img src={button} alt="list" />
            </div>
            <div className="message-container">
              <h2>
                Record a single butterfly or create a list of different species
                seen
              </h2>
              <div className="message">
                <p>
                  Tap on the Record button to record a single species or hold
                  the Record button down to start a species list.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide style={{ backgroundImage: `url(${fritillary})` }}>
            <h3 className="app-name">
              iRecord <b>Butterflies</b>
            </h3>
            <div className="message-container">
              <div className="message">
                <p>
                  Your sightings will help to protect butterflies and the
                  environment.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </Main>

      <IonFooter className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              onClick={slideNextOrClose}
              color="primary"
              fill="solid"
              shape="round"
            >
              <IonIcon
                icon={!moreSlidesExist ? checkmarkOutline : arrowForward}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </Page>
  );
};

export default observer(OnBoardingScreens);
