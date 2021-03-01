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
import getProbabilities from 'common/data/species/probabilities';
import SpeciesProfile from './components/SpeciesProfile';
import thumbnailPlaceholder from './thumbnail.png';
import './styles.scss';

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
function getCurrentWeekNumber() {
  const d = new Date();
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const currentLocation = null; // 'SU68';
const currentWeek = getCurrentWeekNumber();

const byName = (sp1, sp2) => sp1.commonName.localeCompare(sp2.commonName);

function organiseByProbability(allSpecies) {
  const probabilitiesForWeek = getProbabilities(currentWeek, currentLocation);
  const isProbable = ({ id }) => probabilitiesForWeek[id] >= 0;
  const byProbability = (s1, s2) =>
    probabilitiesForWeek[s2.id] - probabilitiesForWeek[s1.id];

  const probableSpecies = allSpecies.filter(isProbable).sort(byProbability);

  const notInProbableList = sp => !probableSpecies.includes(sp);
  const remainingSpecies = allSpecies.filter(notInProbableList).sort(byName);

  return [probableSpecies, remainingSpecies];
}

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
    const [speciesList, additionalSpeciesList] = organiseByProbability(
      speciesData
    );

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
        {speciesList.map(this.getSpeciesTile)}

        {hasAdditional && (
          <IonItemDivider sticky>
            <IonLabel>Additional</IonLabel>
          </IonItemDivider>
        )}
        {additionalSpeciesList.map(this.getSpeciesTile)}
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
