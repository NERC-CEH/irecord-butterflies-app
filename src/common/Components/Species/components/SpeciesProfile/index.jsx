import React from 'react';
import {
  IonCardHeader,
  IonButton,
  IonCardContent,
  IonLifeCycleContext,
  IonIcon,
  IonSlides,
  IonSlide,
  IonChip,
} from '@ionic/react';
import { expandOutline } from 'ionicons/icons';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Main, Gallery } from '@apps';
import { Trans as T } from 'react-i18next';
import './styles.scss';

const fixIonicSlideBug = e => {
  // TODO: remove once bug is fixed
  // https://github.com/ionic-team/ionic/issues/19641
  // https://github.com/ionic-team/ionic/issues/19638
  e.target.update();
};

class SpeciesProfile extends React.Component {
  static contextType = IonLifeCycleContext;

  state = {
    showGallery: null,
    showLifechart: false,
    showMap: false,
  };

  getFullScreenPhotoViewer = () => {
    const { species } = this.props;
    const { showGallery, showLifechart, showMap } = this.state;

    let items = [];

    const setShowGallery = () =>
      this.setState({
        showGallery: false,
        showLifechart: false,
        showMap: false,
      });

    if (Number.isInteger(showGallery)) {
      const getImageSource = img => ({ src: img });
      items = species.images.map(getImageSource);
    }

    if (showLifechart) {
      items.push({ src: species.lifechart });
    }
    if (showMap) {
      items.push({ src: species.map });
    }

    if (!items.length) {
      return null;
    }

    return (
      <Gallery
        isOpen
        items={items}
        initialSlide={showGallery || 1}
        onClose={setShowGallery}
      />
    );
  };

  showPhotoInFullScreen = index => this.setState({ showGallery: index });

  showshowLifechartInFullScreen = () => this.setState({ showLifechart: true });

  showMapInFullScreen = () => this.setState({ showMap: true });

  getSlides = () => {
    const { species } = this.props;
    const { images } = species;

    const slideOpts = {
      initialSlide: 0,
      speed: 400,
    };

    const getSlide = (src, index) => {
      const showPhotoInFullScreenWrap = () => this.showPhotoInFullScreen(index);

      return (
        <IonSlide
          key={src}
          class="species-profile-photo"
          onClick={showPhotoInFullScreenWrap}
          // style={{
          //   background: `url(${src})`,
          // }}
        >
          <img src={src} />
        </IonSlide>
      );
    };

    const slideImage = images.map(getSlide);

    return (
      <IonSlides
        pager
        options={slideOpts}
        onIonSlidesDidLoad={fixIonicSlideBug}
      >
        {slideImage}
      </IonSlides>
    );
  };

  getMap = () => {
    const { species } = this.props;

    if (!species.map) {
      return <p>Sorry, this species doesn't have a map.</p>;
    }

    return (
      <div
        className="fullscreen-tappable map"
        onClick={this.showMapInFullScreen}
      >
        <img src={species.map} />
        <div className="fullscreen-btn">
          <IonIcon src={expandOutline} slot="end" color="secondary" />
        </div>
      </div>
    );
  };

  render() {
    const { species, onRecord, isSurvey } = this.props;

    if (!species) {
      return null;
    }

    return (
      <>
        {this.getFullScreenPhotoViewer()}

        <Main id="species-profile" class="ion-padding">
          {this.getSlides()}

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

            {species.lifechart && (
              <>
                <h3>
                  <T>When to see</T>:
                </h3>
                <div
                  className="fullscreen-tappable"
                  onClick={this.showshowLifechartInFullScreen}
                >
                  <div className="fullscreen-btn">
                    <IonIcon src={expandOutline} slot="end" color="secondary" />
                  </div>
                  <img src={species.lifechart} />
                </div>
              </>
            )}
            {species.map && (
              <>
                <h3>
                  <T>Distribution</T>:
                </h3>
                {this.getMap()}
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
  }
}

SpeciesProfile.propTypes = exact({
  onRecord: PropTypes.func.isRequired,
  species: PropTypes.object,
  isSurvey: PropTypes.bool,
});

export default SpeciesProfile;
