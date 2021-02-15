import { observer } from 'mobx-react';
import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {
  IonGrid,
  IonItemDivider,
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
import { arrowBack, informationCircleOutline } from 'ionicons/icons';
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
  static propTypes = exact({
    onSelect: PropTypes.func,
  });

  state = {
    species: null,
  };

  hideSpeciesModal = () => {
    this.setState({ species: null });
  };

  getSpeciesTile = (sp, i) => {
    const { onSelect } = this.props;

    const { commonName, thumbnail } = sp;
    const color = colours[sp.colour[0]];

    const isSurvey = !!onSelect;
    const viewSpecies = e => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ species: sp });
    };

    const selectSpecies = () => onSelect(sp);

    const onClick = isSurvey ? selectSpecies : viewSpecies;

    return (
      <IonCol
        key={i}
        className="species-tile"
        size="6"
        sizeMd="4"
        onClick={onClick}
      >
        <div
          className="container"
          style={{
            boxShadow: `inset 0px 0px 70px ${color}25`,
          }}
        >
          {isSurvey && (
            <div className="info-box" onClick={viewSpecies}>
              <IonIcon icon={informationCircleOutline} />
            </div>
          )}
          <img src={thumbnail} />
          <IonLabel>{commonName}</IonLabel>
        </div>
      </IonCol>
    );
  };

  getSpecies = () => {
    const isNotAditional = sp => !sp.additional;
    const speciesList = species.filter(isNotAditional).map(this.getSpeciesTile);

    const isAditional = sp => sp.additional;
    const additionalSpeciesList = species
      .filter(isAditional)
      .map(this.getSpeciesTile);

    const hasAdditional = !!additionalSpeciesList.length;

    return (
      <>
        {speciesList}

        {hasAdditional && (
          <IonItemDivider sticky>
            <IonLabel>Additional</IonLabel>
          </IonItemDivider>
        )}
        {additionalSpeciesList}
      </>
    );
  };

  onRecord = () => {};

  render() {
    const { onSelect } = this.props;

    return (
      <Main className="species-list">
        <IonGrid>
          <IonRow>{this.getSpecies()}</IonRow>
        </IonGrid>

        <IonModal
          isOpen={!!this.state.species}
          backdropDismiss={false}
          mode="md"
        >
          <IonHeader className="species-modal-header">
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={this.hideSpeciesModal}>
                  <IonIcon slot="icon-only" icon={arrowBack} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <SpeciesProfile
            species={this.state.species}
            onRecord={this.hideSpeciesModal}
            isSurvey={!!onSelect}
          />
        </IonModal>
      </Main>
    );
  }
}

export default SpeciesMainComponent;
