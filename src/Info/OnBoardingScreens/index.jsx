import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Main } from '@apps';
import { observer } from 'mobx-react';
import {
  IonSlides,
  IonSlide,
  IonButton,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonFooter,
} from '@ionic/react';
import { arrowForward, checkmarkOutline } from 'ionicons/icons';
import peacock from './images/peacock.jpg';
import brimstone from './images/brimstone.jpg';
import fritillary from './images/fritillary.jpg';
import list from './images/list.png';
import './styles.scss';

const SplashScreen = ({ appModel }) => {
  const [isEnd, setIsEnd] = useState(false);

  function exit() {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showedWelcome = true;
    appModel.save();
  }
  const slideRef = useRef(null);

  const handleSlideChangeStart = async () => {
    const isThisLastSlide = await slideRef.current.isEnd();
    setIsEnd(isThisLastSlide);
  };

  const onIonSlidesDidLoadWrap = e => {
    // TODO: remove once bug is fixed
    // https://github.com/ionic-team/ionic/issues/19641
    // https://github.com/ionic-team/ionic/issues/19638
    e.target.update();
  };

  const slideNextOrClose = async () => {
    if (!isEnd) {
      slideRef.current.swiper.slideNext();
      return;
    }

    exit();
  };
  return (
    <Page id="welcome-page">
      <Main>
        <IonSlides
          pager
          ref={slideRef}
          onIonSlideWillChange={handleSlideChangeStart}
          onIonSlidesDidLoad={onIonSlidesDidLoadWrap}
        >
          <IonSlide style={{ backgroundImage: `url(${peacock})` }}>
            <h3 className="app-name">
              iRecord <b>Butterflies</b>
            </h3>
            <div className="message-container">
              <div className="message">
                <p>Identify butterflies that you see.</p>
              </div>
            </div>
          </IonSlide>

          <IonSlide>
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
          </IonSlide>

          <IonSlide style={{ backgroundImage: `url(${brimstone})` }}>
            <h3 className="app-name">
              iRecord <b>Butterflies</b>
            </h3>
            <div className="message-container">
              <div className="message">
                <p>Submit and share your sightings through iRecord.</p>
              </div>
            </div>
          </IonSlide>

          <IonSlide style={{ backgroundImage: `url(${fritillary})` }}>
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
          </IonSlide>
        </IonSlides>
      </Main>

      <IonFooter className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={slideNextOrClose}>
              <IonIcon icon={isEnd ? checkmarkOutline : arrowForward} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </Page>
  );
};

SplashScreen.propTypes = exact({
  appModel: PropTypes.object.isRequired,
});

const onBoardingScreens = ({ appModel, children }) => {
  const { showedWelcome } = appModel.attrs;

  if (!showedWelcome) {
    return <SplashScreen appModel={appModel} />;
  }

  return children;
};

onBoardingScreens.propTypes = exact({
  appModel: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
});

export default observer(onBoardingScreens);
