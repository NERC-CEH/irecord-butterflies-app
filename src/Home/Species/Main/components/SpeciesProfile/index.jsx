import React from 'react';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonLifeCycleContext,
} from '@ionic/react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Main, Gallery } from '@apps';
import { Trans as T } from 'react-i18next';
import './styles.scss';

class SpeciesProfile extends React.Component {
  static contextType = IonLifeCycleContext;

  state = {
    showGallery: null,
  };

  getGallery = () => {
    const { species } = this.props;
    const { showGallery } = this.state;

    const items = [
      {
        src: `/images/${species.image}_image.jpg`,
        w: species.image_width || 800,
        h: species.image_height || 800,
        title: `© ${species.image_copyright}`,
      },
    ];

    const setShowGallery = () => this.setState({ showGallery: false });

    return (
      <Gallery
        isOpen={!!showGallery}
        items={items}
        initialSlide={showGallery}
        onClose={setShowGallery}
      />
    );
  };

  render() {
    const { species } = this.props;

    if (!species) {
      return null;
    }

    /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
    return (
      <>
        {this.getGallery()}

        <Main id="species-profile" class="ion-padding">
          {/* <img
            src={`/images/${species.image}_image.jpg`}
            alt="species"
            onClick={() => this.setState({ showGallery: 1 })}
          /> */}

          <IonCardHeader>
            <IonCardTitle>{species.taxon}</IonCardTitle>
            <IonCardSubtitle>{species.taxon}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <h3 className="species-label">
              <T>Description</T>:
            </h3>
          </IonCardContent>
        </Main>
      </>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
  }
}

SpeciesProfile.propTypes = exact({
  species: PropTypes.object,
});

export default SpeciesProfile;
