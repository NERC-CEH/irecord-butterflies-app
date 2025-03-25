import { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { arrowBack, informationCircleOutline } from 'ionicons/icons';
import { Main, InfoBackgroundMessage, useAlert } from '@flumens';
import {
  NavContext,
  IonModal,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import ProbabilityBadge from 'common/Components/ProbabilityBadge';
import config from 'common/config';
import species, { Species } from 'common/data/species';
import getProbabilities from 'common/data/species/probabilities';
import appModel, { FilterGroup, Filter, Filters } from 'models/app';
import getCurrentWeekNumber from 'helpers/weeks';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

const useShowMothInformationDialog = (mothSpecies: any) => {
  const alert = useAlert();
  const { navigate } = useContext(NavContext);

  const showMothInformationDialog = () => {
    const { useMoths, showMothSpeciesTip } = appModel.data;

    if (!mothSpecies?.length || useMoths || !showMothSpeciesTip) return;

    appModel.data.showMothSpeciesTip = false;
    appModel.save();

    alert({
      header: 'Moth species detected',
      message: (
        <>
          You can record selected moth species with this app by visiting the app
          settings in the Menu and switching on <b>Enable moth species</b>.
        </>
      ),
      backdropDismiss: false,
      buttons: [
        {
          text: 'App Settings',
          handler: () => navigate('/settings/menu'),
        },
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
  };

  useEffect(showMothInformationDialog, []);
};

const byName = (sp1: Species, sp2: Species) =>
  sp1.commonName.localeCompare(sp2.commonName);

const existing = (sp: any): sp is Species => !!sp;

function organiseByProbability(
  allSpecies: Species[],
  week?: number,
  hectad?: string
) {
  const hectadName = hectad || appModel.data?.location?.gridref;

  const weekNo = week || getCurrentWeekNumber();

  const [probsNowAndHere, probsHere, probsNow] = getProbabilities(
    weekNo,
    hectadName
  );

  const getSpeciesProfile = (id: string) => {
    const byId = (sp: Species) => sp.id === id;
    return allSpecies.find(byId);
  };

  const speciesHereAndNow: Species[] = probsNowAndHere
    .map(getSpeciesProfile)
    .filter(existing);

  const speciesHere: Species[] = probsHere
    .map(getSpeciesProfile)
    .filter(existing)
    .sort(byName);

  const speciesNow: Species[] = probsNow
    .map(getSpeciesProfile)
    .filter(existing);

  const notInProbableLists = (sp: Species) =>
    !speciesHereAndNow.includes(sp) &&
    !speciesHere.includes(sp) &&
    !speciesNow.includes(sp);

  const remainingSpecies = allSpecies.filter(notInProbableLists).sort(byName);

  return [speciesHereAndNow, speciesHere, speciesNow, remainingSpecies];
}

// const shouldShowFeedback = () => false; // TODO: enable this back
// const { feedbackGiven, appSession } = appModel.data;
// if (feedbackGiven) {
//   return false;
// }
// return appSession > 10;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type Props = {
  filters: Filters;
  onSelect?: (sp: Species) => void;
  ignore?: any[];
  searchPhrase?: string;
  week?: number;
  hectad?: string;
  identifiedSpeciesList?: any;
};

const SpeciesList = ({
  filters = {},
  onSelect,
  ignore = [],
  searchPhrase = '',
  week,
  hectad,
  identifiedSpeciesList,
}: Props) => {
  const { navigate } = useContext(NavContext);
  const [speciesProfile, setSpeciesProfile] = useState<Species | null>(null);

  const byMoth = (sp: any) =>
    sp.type === 'moth' && sp.probability > config.POSITIVE_THRESHOLD;
  const mothSpecies = identifiedSpeciesList?.filter(byMoth);

  useShowMothInformationDialog(mothSpecies);

  // const onFeedbackDone = () => {
  //   appModel.data.feedbackGiven = true;
  //   appModel.save();
  // };

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const onSpeciesRecord = (sp: any) => {
    hideSpeciesModal();
    navigate(`/survey/point?speciesId=${sp.id}`);
  };

  const getSpeciesTile = (sp: Species, i: number) => {
    const {
      commonName,
      thumbnail: thumbnailSrc,
      thumbnailBackground,
      taxonMeaningId,
    } = sp;

    const byTaxonMeaningId = (s: any) =>
      parseInt(s?.taxon_meaning_id, 10) === taxonMeaningId;
    const [identifiedSpecies] =
      identifiedSpeciesList?.filter(byTaxonMeaningId) || [];

    const { probability } = identifiedSpecies || {};

    const isSurvey = !!onSelect;
    const viewSpecies = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setSpeciesProfile(sp);
    };

    const selectSpecies = () => onSelect && onSelect(sp);

    const onClick = isSurvey ? selectSpecies : viewSpecies;

    return (
      <div key={i} className="species-tile z-0" onClick={onClick}>
        <div className="wrapper">
          {identifiedSpecies && <ProbabilityBadge probability={probability} />}
          {isSurvey && (
            <div className="info-box" onClick={viewSpecies}>
              <IonIcon icon={informationCircleOutline} />
            </div>
          )}
          <img className="thumbnail" src={thumbnailSrc} />
          {thumbnailBackground && (
            <img className="thumbnail-background" src={thumbnailBackground} />
          )}
          {!thumbnailBackground && (
            <div className="thumbnail-background">
              <img src={thumbnailSrc} />
            </div>
          )}
          <IonLabel className="common-name">{commonName}</IonLabel>
        </div>
      </div>
    );
  };

  const skipIdentifiedMothSpecies = (taxonMeaningId: number) => {
    const taxonMeaningIdMatch = (sp: any) =>
      parseInt(sp.taxon_meaning_id, 10) === taxonMeaningId;

    return mothSpecies?.some(taxonMeaningIdMatch);
  };

  const getSpeciesData = () => {
    const { useMoths } = appModel.data;

    let filteredSpecies: Species[] = [...species];

    const skipNotInGuide = ({ inGuide }: Species) => inGuide;
    filteredSpecies = filteredSpecies.filter(skipNotInGuide);

    if (ignore.length) {
      const skipIgnored = ({ id }: Species) => !ignore.includes(id);
      filteredSpecies = filteredSpecies.filter(skipIgnored);
    }

    if (!useMoths) {
      const isNotMoth = ({ type, taxonMeaningId }: Species) =>
        type !== 'moth' || skipIdentifiedMothSpecies(taxonMeaningId);

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

    const { useProbabilitiesForGuide, useSmartSorting } = appModel.data;

    const [speciesHereAndNow, speciesHere, speciesNow, remainingSpecies] =
      organiseByProbability(speciesData, week, hectad);

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
      <div className="relative col-span-2 mx-auto grid w-full grid-cols-2">
        {hasSpeciesHereAndNow && (
          <div className="sticky top-0 z-10 col-span-2 bg-primary p-2 text-center text-white">
            Flying now in your area
          </div>
        )}
        {speciesTiles(speciesHereAndNow)}

        {hasSpeciesNow && (
          <div className="sticky top-0 z-10 col-span-2 bg-[#51735f] p-2 text-center text-white">
            Flying at this time of year
          </div>
        )}
        {speciesTiles(speciesNow)}

        {hasSpeciesHere && (
          <div className="sticky top-0 z-10 col-span-2 bg-[#51735f] p-2 text-center text-white">
            In your area at other times of year
          </div>
        )}
        {speciesTiles(speciesHere)}

        {hasAdditional && (
          <div className="sticky top-0 z-10 col-span-2 bg-neutral-600 p-2 text-center text-white">
            {hasSpeciesNow
              ? 'Flying at other times of year'
              : 'Species not recorded from your area'}
          </div>
        )}
        {speciesTiles(remainingSpecies)}
      </div>
    );
  };

  // const isSurvey = !!onSelect;
  // const showFeedback = !isSurvey && shouldShowFeedback();

  return (
    <Main className="species-list">
      {/* <div className="relative mt-20 block h-full w-full overflow-scroll"> */}
      {/* {showFeedback && (
          <IonRow className="user-feedback-row">
            <IonCol size="12">
              <UserFeedbackRequest
                email={config.feedbackEmail}
                onFeedbackDone={onFeedbackDone}
              />
            </IonCol>
          </IonRow>
        )} */}

      {getSpecies()}

      <IonModal isOpen={!!speciesProfile} backdropDismiss={false} mode="md">
        <IonHeader className="species-modal-header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                onClick={hideSpeciesModal}
                fill="solid"
                color="light"
                shape="round"
              >
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <SpeciesProfile
          species={speciesProfile}
          onNavBack={hideSpeciesModal}
          onRecord={onSpeciesRecord}
          isSurvey={!!onSelect}
        />
      </IonModal>
    </Main>
  );
};

export default observer(SpeciesList);
