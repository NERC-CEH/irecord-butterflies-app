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
} from '@ionic/react';
import { Main, toast, ModalHeader } from '@apps';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import species from 'common/data/species.json';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

const inWIP = () => toast.warn('Sorry, this is still WIP.');

const colours = {
  Yellow: '#ffff00',
  Green: '#006400',
  Cream: '#f5fffa',
  Gray: '#a9a9a9',
  Black: '#000',
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
    // TODO:
  };

  getSpeciesTile = (sp, i) => {
    const { commonName } = sp;
    const color = colours[sp.colour[0]];

    return (
      <IonCol
        key={i}
        className="species-tile"
        size="6"
        // onClick={() => this.setState({ species: sp })}
        onClick={inWIP}
      >
        <div
          className="container"
          style={{
            boxShadow: `inset 0px 0px 35px ${color}17`,
          }}
        >
          <IonIcon icon={butterflyIcon} alt="" />
          <IonLabel>{commonName}</IonLabel>
        </div>
      </IonCol>
    );
  };

  getSpecies = () => species.map(this.getSpeciesTile);

  render() {
    return (
      <Main>
        <IonGrid>
          <IonRow>{this.getSpecies()}</IonRow>
        </IonGrid>

        <IonModal isOpen={this.state.species} backdropDismiss={false}>
          <ModalHeader onClose={this.hideSpeciesModal} />
          <SpeciesProfile species={this.state.species} />
        </IonModal>
      </Main>
    );
  }
}

export default SpeciesMainComponent;
