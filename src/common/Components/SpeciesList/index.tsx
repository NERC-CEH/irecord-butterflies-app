import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
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
import species, { Species } from 'common/data/species';
import config from 'common/config';
import getCurrentWeekNumber from 'helpers/weeks';
import getProbabilities from 'common/data/species/probabilities';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

const byName = (sp1: Species, sp2: Species) =>
  sp1.commonName.localeCompare(sp2.commonName);

function organiseByProbability(allSpecies: Species[]) {
  const location = appModel.attrs.location || {};
  const currentLocation = location.gridref;
  const currentWeek = getCurrentWeekNumber();

  const [probsNowAndHere, probsHere, probsNow] = getProbabilities(
    currentWeek,
    currentLocation
  );

  const isProbableHOF = (probs: any) => {
    const isProbable = ({ id }: Species) => probs[id] >= 0;
    return isProbable;
  };
  const byProbabilityHOF = (probs: any) => {
    const byProbability = (s1: Species, s2: Species) =>
      probs[s2.id] - probs[s1.id];
    return byProbability;
  };

  const speciesHereAndNow = allSpecies
    .filter(isProbableHOF(probsNowAndHere))
    .sort(byProbabilityHOF(probsNowAndHere));

  const speciesHere = allSpecies.filter(isProbableHOF(probsHere)).sort(byName);

  const speciesNow = allSpecies
    .filter(isProbableHOF(probsNow))
    .sort(byProbabilityHOF(probsNow));

  const notInProbableLists = (sp: Species) =>
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
function escapeRegexCharacters(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type FilterGroup = 'colour' | 'markings' | 'size' | 'group' | 'country';
type Filter = string;
type Filters = {
  [key in FilterGroup]: Filter[];
};

type Props = {
  filters: Filters;
  onSelect?: (sp: Species) => void;
  ignore?: any[];
  searchPhrase?: string;
};

const SpeciesList: FC<Props> = ({
  filters = {},
  onSelect,
  ignore = [],
  searchPhrase = '',
}) => {
  const [speciesProfile, setSpeciesProfile] = useState<Species | null>(null);

  const onFeedbackDone = () => {
    appModel.attrs.feedbackGiven = true;
    appModel.save();
  };

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const getSpeciesTile = (sp: Species, i: number) => {
    const { commonName, thumbnail: thumbnailSrc } = sp;

    const isSurvey = !!onSelect;
    const viewSpecies = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setSpeciesProfile(sp);
    };

    const selectSpecies = () => onSelect && onSelect(sp);

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

  const getSpeciesData = () => {
    const { useMoths } = appModel.attrs;

    let filteredSpecies: Species[] = [...species];

    if (ignore.length) {
      const skipIgnored = ({ id }: Species) => !ignore.includes(id);
      filteredSpecies = filteredSpecies.filter(skipIgnored);
    }

    if (!useMoths) {
      const isNotMoth = ({ type }: Species) => type !== 'moth';
      filteredSpecies = filteredSpecies.filter(isNotMoth);
    }

    const filterBySearchPhrase = (sp: Species) => {
      const re = new RegExp(escapeRegexCharacters(searchPhrase), 'i');
      return re.test(sp.commonName);
    };

    if (searchPhrase) {
      filteredSpecies = filteredSpecies.filter(filterBySearchPhrase);
    }

    if (Object.keys(filters).length) {
      const processFilterType = ([key, values]: any) => {
        const filterGroup = key as FilterGroup;
        const filterGroupValues = values as Filter[];

        const speciesMatchesFilter = (sp: Species) => {
          if (!filterGroupValues.length) {
            return true;
          }

          if (Array.isArray(sp[filterGroup])) {
            const matchesSpeciesValues = (v: Filter) =>
              filterGroupValues.includes(v);
            const intersection = (sp[filterGroup] as Filter[]).filter(
              matchesSpeciesValues
            );
            return intersection.length;
          }

          return filterGroupValues.includes(sp[filterGroup] as Filter);
        };

        filteredSpecies = filteredSpecies.filter(speciesMatchesFilter);
      };

      Object.entries(filters).forEach(processFilterType);
    }

    return filteredSpecies;
  };

  const getSpecies = () => {
    const speciesData = getSpeciesData();
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

    const alphabetically = (sp1: Species, sp2: Species) =>
      sp1.commonName.localeCompare(sp2.commonName);

    const speciesTiles = (speciesList: Species[]) =>
      useSmartSorting
        ? speciesList.map(getSpeciesTile)
        : speciesList.sort(alphabetically).map(getSpeciesTile);

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
      return speciesData.sort(alphabetically).map(getSpeciesTile);
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

  const showFeedback = shouldShowFeedback();

  return (
    <Main className="species-list">
      <IonGrid>
        {showFeedback && (
          <IonRow className="user-feedback-row">
            <IonCol size="12">
              <UserFeedbackRequest
                email={config.feedbackEmail}
                onFeedbackDone={onFeedbackDone}
              />
            </IonCol>
          </IonRow>
        )}

        <IonRow>{getSpecies()}</IonRow>
      </IonGrid>

      <IonModal isOpen={!!speciesProfile} backdropDismiss={false} mode="md">
        <IonHeader className="species-modal-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={hideSpeciesModal}>
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <SpeciesProfile
          species={speciesProfile}
          onRecord={hideSpeciesModal}
          isSurvey={!!onSelect}
        />
      </IonModal>
    </Main>
  );
};

export default observer(SpeciesList);