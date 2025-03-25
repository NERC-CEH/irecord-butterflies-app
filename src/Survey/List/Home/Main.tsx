import { useContext } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { locationOutline, filterOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  MenuAttrItemFromModel,
  Button,
} from '@flumens';
import {
  IonList,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItem,
  IonItemSliding,
  NavContext,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import VerificationStatus from 'common/Components/VerificationStatus';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import DisabledRecordMessage from 'Survey/common/Components/DisabledRecordMessage';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';
import MenuDateAttr from 'Survey/common/Components/MenuDateAttr';

const speciesNameSort = (occ1: Occurrence, occ2: Occurrence) => {
  const taxon1 = occ1.data.taxon;
  const taxonName1 = taxon1.commonName;

  const taxon2 = occ2.data.taxon;
  const taxonName2 = taxon2.commonName;

  return taxonName1.localeCompare(taxonName2);
};

const speciesOccAddedTimeSort = (occ1: Occurrence, occ2: Occurrence) => {
  const date1 = new Date(occ1.createdAt);
  const date2 = new Date(occ2.createdAt);
  return date2.getTime() - date1.getTime();
};

type Props = {
  sample: Sample;
  deleteOccurrence: any;
  navigateToOccurrence: any;
  listSurveyListSortedByTime: any;
  increaseCount: any;
  isDisabled: boolean;
  onToggleSpeciesSort?: any;
};

const HomeMain = ({
  sample,
  isDisabled,
  deleteOccurrence,
  navigateToOccurrence,
  listSurveyListSortedByTime,
  increaseCount,
  onToggleSpeciesSort,
}: Props) => {
  const match = useRouteMatch();
  const { navigate } = useContext(NavContext);

  const getLocationButton = () => {
    const location = sample.data.location || {};
    const hasLocation = location.latitude;
    const hasName = location.name;
    const empty = !hasLocation || !hasName;

    const value = (
      <div className="m-0 flex flex-col items-end justify-center">
        <GridRefValue sample={sample} requiredMessage="No location" />
        <span>{location.name || 'No site name'}</span>
      </div>
    );

    const isOutsideUK = hasLocation && !location.gridref;
    const inacurate = location.gridref && location.gridref.length <= 5;

    return (
      <>
        <MenuAttrItem
          routerLink={`${match.url}/location`}
          value={value}
          icon={locationOutline}
          label="Location"
          skipValueTranslation
          required
          className={clsx({ empty })}
          disabled={isDisabled}
        />
        {isOutsideUK && !isDisabled && (
          <InfoMessage color="warning">
            Your location is not in the UK, Republic of Ireland, Isle of Man or
            Channel Islands. Please tap on Location to change if necessary.
          </InfoMessage>
        )}
        {inacurate && !isDisabled && (
          <InfoMessage color="warning">
            Please select a more accurate location.
          </InfoMessage>
        )}
      </>
    );
  };

  const getSpeciesAddButton = () => {
    if (isDisabled) {
      return null;
    }

    return (
      <Button
        color="primary"
        id="add"
        onPress={() => navigate(`/survey/list/${sample.cid}/species`)}
      >
        Add species
      </Button>
    );
  };

  const getSpeciesList = () => {
    if (!sample.occurrences.length) {
      return (
        <IonList id="list" lines="full">
          <InfoBackgroundMessage>No species added</InfoBackgroundMessage>
        </IonList>
      );
    }

    const sort = listSurveyListSortedByTime
      ? speciesOccAddedTimeSort
      : speciesNameSort;

    const occurrences = [...sample.occurrences].sort(sort);

    const getSpeciesEntry = (occ: Occurrence) => {
      const isSpeciesDisabled = !occ.data.count;

      const increaseCountWrap = () => increaseCount(occ);
      const increase5xCountWrap = () => increaseCount(occ, true);

      const navToOccurrenceWrap = () =>
        !isSpeciesDisabled && navigateToOccurrence(occ);
      const deleteOccurrenceWrap = () => deleteOccurrence(occ);

      const speciesName =
        occ.data.taxon?.commonName || occ.data.taxon?.scientificName;

      return (
        <IonItemSliding key={occ.cid}>
          <IonItem
            detail={!isSpeciesDisabled && !occ.hasOccurrenceBeenVerified()}
          >
            <VerificationStatus occ={occ} />

            <IncrementalButton
              onClick={increaseCountWrap}
              onLongClick={increase5xCountWrap}
              value={occ.data.count as number}
              disabled={isDisabled}
            />
            <IonLabel onClick={navToOccurrenceWrap}>{speciesName}</IonLabel>
          </IonItem>
          {!isDisabled && (
            <IonItemOptions side="end">
              <IonItemOption color="danger" onClick={deleteOccurrenceWrap}>
                Delete
              </IonItemOption>
            </IonItemOptions>
          )}
        </IonItemSliding>
      );
    };

    const speciesList = occurrences.map(getSpeciesEntry);

    return (
      <>
        <div id="species-list-sort">
          <IonButton fill="clear" size="small" onClick={onToggleSpeciesSort}>
            <IonIcon icon={filterOutline} mode="md" />
          </IonButton>
        </div>

        <IonList id="list" lines="full">
          <div className="rounded-list">
            <div className="list-divider gap-4">
              <div>Count</div>
              <div className="flex w-full justify-between">
                <div>Species</div>
                <div>{speciesList.length}</div>
              </div>
            </div>

            {speciesList}
          </div>

          {!isDisabled && (
            <InfoBackgroundMessage name="showSpeciesDeleteTip">
              To delete any species swipe it to the left.
            </InfoBackgroundMessage>
          )}
        </IonList>
      </>
    );
  };

  return (
    <Main>
      <IonList lines="full">
        {isDisabled && <DisabledRecordMessage sample={sample} />}

        <h3 className="list-title">Details</h3>
        <div className="rounded-list">
          <MenuDateAttr record={sample.data} isDisabled={isDisabled} />
          {getLocationButton()}
          <MenuAttrItemFromModel model={sample} attr="area" />
        </div>

        {getSpeciesAddButton()}
      </IonList>

      {getSpeciesList()}
    </Main>
  );
};

export default observer(HomeMain);
