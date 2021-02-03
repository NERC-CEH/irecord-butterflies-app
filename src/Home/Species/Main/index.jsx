import { observer } from 'mobx-react';
import React from 'react';
// import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {
  IonGrid,
  IonCol,
  IonModal,
  IonRow,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import { Main } from '@apps';
import { arrowBack } from 'ionicons/icons';
import species from 'common/data/species';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

const colours = {
  Yellow: '#ffff00',
  Green: '#006400',
  Cream: '#f5fffa',
  Gray: '#a9a9a9',
  Black: '#000000',
  Blue: '#007eff',
  White: '#ffffff',
  Purple: '#e42de4',
  Orange: '#ffa500',
  Brown: '#8b4513',
};
@observer
class SpeciesMainComponent extends React.Component {
  static propTypes = exact({});

  state = {
    species: null,
  };

  hideSpeciesModal = () => {
    this.setState({ species: null });
  };

  getSpeciesTile = (sp, i) => {
    const { commonName, thumbnail } = sp;
    const color = colours[sp.colour[0]];

    const setSpecies = () => this.setState({ species: sp });

    return (
      <IonCol key={i} className="species-tile" size="6" onClick={setSpecies}>
        <div
          className="container"
          style={{
            boxShadow: `inset 0px 0px 70px ${color}25`,
          }}
        >
          <img src={thumbnail} />
          <IonLabel>{commonName}</IonLabel>
        </div>
      </IonCol>
    );
  };

  getSpecies = () => species.map(this.getSpeciesTile);

  onRecord = () => {};

  render() {
    return (
      <Main>
        <IonGrid>
          <IonRow>{this.getSpecies()}</IonRow>
        </IonGrid>

        <IonModal isOpen={!!this.state.species} backdropDismiss={false}>
          <IonHeader className="species-modal-header">
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={this.hideSpeciesModal}>
                  <IonIcon slot="icon-only" icon={arrowBack} color="light" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <SpeciesProfile
            species={this.state.species}
            onRecord={this.hideSpeciesModal}
          />
        </IonModal>
      </Main>
    );
  }
}

export default SpeciesMainComponent;
