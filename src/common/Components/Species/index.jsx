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
import { Main, InfoBackgroundMessage, UserFeedbackRequest } from '@apps';
import appModel from 'models/app';
import { arrowBack, informationCircleOutline } from 'ionicons/icons';
import species from 'common/data/species';
import config from 'common/config';
import getCurrentWeekNumber from 'helpers/weeks';
import getProbabilities from 'common/data/species/probabilities';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

const byName = (sp1, sp2) => sp1.commonName.localeCompare(sp2.commonName);

function organiseByProbability(allSpecies) {
  const location = appModel.attrs.location || {};
  const currentLocation = location.gridref;
  const currentWeek = getCurrentWeekNumber();

  const [probsNowAndHere, probsHere, probsNow] = getProbabilities(
    currentWeek,
    currentLocation
  );
  const isProbable = probs => ({ id }) => probs[id] >= 0; //eslint-disable-line
  const byProbability = probs => (s1, s2) => probs[s2.id] - probs[s1.id]; //eslint-disable-line

  const speciesHereAndNow = allSpecies
    .filter(isProbable(probsNowAndHere))
    .sort(byProbability(probsNowAndHere));

  const speciesHere = allSpecies.filter(isProbable(probsHere)).sort(byName);

  const speciesNow = allSpecies
    .filter(isProbable(probsNow))
    .sort(byProbability(probsNow));

  const notInProbableLists = sp =>
    !speciesHereAndNow.includes(sp) &&
    !speciesHere.includes(sp) &&
    !speciesNow.includes(sp);
  const remainingSpecies = allSpecies.filter(notInProbableLists).sort(byName);

  return [speciesHereAndNow, speciesHere, speciesNow, remainingSpecies];
}

const shouldShowFeedback = () => {
  const { feedbackGiven, appSession } = appModel.attrs;
  if (feedbackGiven) {
    return false;
  }

  return appSession > 10;
};

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@observer
class SpeciesMainComponent extends React.Component {
  static propTypes = exact({
    filters: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    ignore: PropTypes.array,
    searchPhrase: PropTypes.string,
  });

  state = {
    species: null,
  };

  onFeedbackDone = () => {
    appModel.attrs.feedbackGiven = true;
    appModel.save();
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
          <img className="thumbnail" src={thumbnailSrc} />
          <div className="thumbnail-background">
            <img src={thumbnailSrc} />
          </div>
          <IonLabel>{commonName}</IonLabel>
        </div>
      </IonCol>
    );
  };

  getSpeciesData = () => {
    const { searchPhrase, filters = {}, ignore = [] } = this.props;
    const { useMoths } = appModel.attrs;

    let filteredSpecies = [...species];

    if (ignore.length) {
      const skipIgnored = ({ id }) => !ignore.includes(id);
      filteredSpecies = filteredSpecies.filter(skipIgnored);
    }

    if (!useMoths) {
      const isNotMoth = ({ type }) => type !== 'moth';
      filteredSpecies = filteredSpecies.filter(isNotMoth);
    }

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
    const { useProbabilitiesForGuide, useSmartSorting } = appModel.attrs;

    const [
      speciesHereAndNow,
      speciesHere,
      speciesNow,
      remainingSpecies,
    ] = organiseByProbability(speciesData);

    const hasSpeciesHereAndNow = !!speciesHereAndNow.length;
    const hasSpeciesHere = !!speciesHere.length;
    const hasSpeciesNow = !!speciesNow.length;
    const hasAdditional = !!remainingSpecies.length;

    const alphabetically = (sp1, sp2) =>
      sp1.commonName.localeCompare(sp2.commonName);

    const speciesTiles = speciesList =>
      useSmartSorting
        ? speciesList.map(this.getSpeciesTile)
        : speciesList.sort(alphabetically).map(this.getSpeciesTile);

    if (
      !hasSpeciesHereAndNow &&
      !hasSpeciesHere &&
      !hasSpeciesNow &&
      !hasAdditional
    ) {
      return (
        <InfoBackgroundMessage>
          Sorry, no species were found.
        </InfoBackgroundMessage>
      );
    }

    if (!useProbabilitiesForGuide) {
      return speciesData.sort(alphabetically).map(this.getSpeciesTile);
    }

    return (
      <>
        {hasSpeciesHereAndNow && (
          <IonItemDivider sticky mode="md">
            <IonLabel>Flying now in your area</IonLabel>
          </IonItemDivider>
        )}
        {speciesTiles(speciesHereAndNow)}
        {hasSpeciesHere && (
          <IonItemDivider sticky className="species-now" mode="md">
            <IonLabel>In your area at other times of year</IonLabel>
          </IonItemDivider>
        )}
        {speciesTiles(speciesHere)}

        {hasSpeciesNow && (
          <IonItemDivider sticky className="species-now" mode="md">
            <IonLabel>Flying at this time of year</IonLabel>
          </IonItemDivider>
        )}
        {speciesTiles(speciesNow)}

        {hasAdditional && (
          <IonItemDivider sticky className="species-additional" mode="md">
            {hasSpeciesNow ? (
              <IonLabel>Flying at other times of year</IonLabel>
            ) : (
              <IonLabel>Species not recorded from your area</IonLabel>
            )}
          </IonItemDivider>
        )}
        {speciesTiles(remainingSpecies)}
      </>
    );
  };

  render() {
    const { onSelect } = this.props;
    const showFeedback = shouldShowFeedback();

    return (
      <Main className="species-list">
        <IonGrid>
          {showFeedback && (
            <IonRow className="user-feedback-row">
              <IonCol size="12">
                <UserFeedbackRequest
                  email={config.feedbackEmail}
                  onFeedbackDone={this.onFeedbackDone}
                />
              </IonCol>
            </IonRow>
          )}

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
