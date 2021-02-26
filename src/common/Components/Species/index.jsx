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
import { Main, InfoBackgroundMessage } from '@apps';
import { arrowBack, informationCircleOutline } from 'ionicons/icons';
import species from 'common/data/species';
import SpeciesProfile from './components/SpeciesProfile';
import thumbnailPlaceholder from './thumbnail.png';
import './styles.scss';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@observer
class SpeciesMainComponent extends React.Component {
  static propTypes = exact({
    filters: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    searchPhrase: PropTypes.string,
  });

  state = {
    species: null,
  };

  hideSpeciesModal = () => {
    this.setState({ species: null });
  };

  getSpeciesTile = (sp, i) => {
    const { onSelect } = this.props;

    const { commonName, thumbnail: thumbnailSrc } = sp;

    const isSurvey = !!onSelect;
    const viewSpecies = e => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ species: sp });
    };

    const selectSpecies = () => onSelect(sp);

    const onClick = isSurvey ? selectSpecies : viewSpecies;

    const thumbnail =
      typeof thumbnailSrc === 'string' ? thumbnailSrc : thumbnailPlaceholder;

    return (
      <IonCol
        key={i}
        className="species-tile"
        size="6"
        sizeMd="4"
        onClick={onClick}
      >
        <div className="container">
          {isSurvey && (
            <div className="info-box" onClick={viewSpecies}>
              <IonIcon icon={informationCircleOutline} />
            </div>
          )}
          <img className="thumbnail" src={thumbnail} />
          <div className="thumbnail-background">
            <img src={thumbnail} />
          </div>
          <IonLabel>{commonName}</IonLabel>
        </div>
      </IonCol>
    );
  };

  getSpeciesData = () => {
    const { searchPhrase, filters = {} } = this.props;

    let filteredSpecies = [...species];

    const filterBySearchPhrase = sp => {
      const re = new RegExp(escapeRegexCharacters(searchPhrase), 'i');
      return re.test(sp.commonName);
    };

    if (searchPhrase) {
      filteredSpecies = filteredSpecies.filter(filterBySearchPhrase);
    }

    if (Object.keys(filters).length) {
      const processFilterType = ([type, values]) => {
        const speciesMatchesFilter = sp => {
          if (!values.length) {
            return true;
          }

          if (Array.isArray(sp[type])) {
            const matchesSpeciesValues = v => values.includes(v);
            const intersection = sp[type].filter(matchesSpeciesValues);
            return intersection.length;
          }

          return values.includes(sp[type]);
        };

        filteredSpecies = filteredSpecies.filter(speciesMatchesFilter);
      };

      Object.entries(filters).forEach(processFilterType);
    }

    return filteredSpecies;
  };

  getSpecies = () => {
    const speciesData = this.getSpeciesData();
    const isNotAditional = sp => !sp.additional;
    const speciesList = speciesData
      .filter(isNotAditional)
      .map(this.getSpeciesTile);

    const isAditional = sp => sp.additional;
    const additionalSpeciesList = speciesData
      .filter(isAditional)
      .map(this.getSpeciesTile);

    const hasAdditional = !!additionalSpeciesList.length;

    if (!speciesList.length && !hasAdditional) {
      return (
        <InfoBackgroundMessage>
          Sorry, no species were found.
        </InfoBackgroundMessage>
      );
    }

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
