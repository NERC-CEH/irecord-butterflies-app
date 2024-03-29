import { FC } from 'react';
import clsx from 'clsx';
import {
  IonItemDivider,
  IonList,
  IonLabel,
  IonButton,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItem,
  IonItemSliding,
} from '@ionic/react';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  MenuAttrItemFromModel,
} from '@flumens';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { locationOutline, filterOutline } from 'ionicons/icons';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import VerificationIcon from 'common/Components/VerificationIcon';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';
import config from 'common/config';

const speciesNameSort = (occ1: Occurrence, occ2: Occurrence) => {
  const taxon1 = occ1.attrs.taxon;
  const taxonName1 = taxon1.commonName;

  const taxon2 = occ2.attrs.taxon;
  const taxonName2 = taxon2.commonName;

  return taxonName1.localeCompare(taxonName2);
};

const speciesOccAddedTimeSort = (occ1: Occurrence, occ2: Occurrence) => {
  const date1 = new Date(occ1.metadata.created_on);
  const date2 = new Date(occ2.metadata.created_on);
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

const HomeMain: FC<Props> = ({
  sample,
  isDisabled,
  deleteOccurrence,
  navigateToOccurrence,
  listSurveyListSortedByTime,
  increaseCount,
  onToggleSpeciesSort,
}) => {
  const match = useRouteMatch();

  const getLocationButton = () => {
    const location = sample.attrs.location || {};
    const hasLocation = location.latitude;
    const hasName = location.name;
    const empty = !hasLocation || !hasName;

    const value = (
      <IonLabel position="stacked" mode="ios">
        <IonLabel color={clsx(empty && hasLocation && 'dark')}>
          <GridRefValue sample={sample} requiredMessage="No location" />
        </IonLabel>
        <IonLabel color={clsx(empty && hasName && 'dark')}>
          {location.name || 'No site name'}
        </IonLabel>
      </IonLabel>
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
      <IonButton
        color="primary"
        id="add"
        routerLink={`/survey/list/${sample.cid}/species`}
      >
        <IonLabel>Add species</IonLabel>
      </IonButton>
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
      const isSpeciesDisabled = !occ.attrs.count;

      const increaseCountWrap = () => increaseCount(occ);
      const increase5xCountWrap = () => increaseCount(occ, true);

      const navToOccurrenceWrap = () =>
        !isSpeciesDisabled && navigateToOccurrence(occ);
      const deleteOccurrenceWrap = () => deleteOccurrence(occ);

      return (
        <IonItemSliding key={occ.cid}>
          <IonItem
            detail={!isSpeciesDisabled && !occ.hasOccurrenceBeenVerified()}
          >
            <VerificationIcon occ={occ} />

            <IncrementalButton
              onClick={increaseCountWrap}
              onLongClick={increase5xCountWrap}
              value={occ.attrs.count as number}
              disabled={isDisabled}
            />
            <IonLabel onClick={navToOccurrenceWrap}>
              {occ.attrs.taxon.commonName}
            </IonLabel>
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
          <div className="rounded">
            <IonItemDivider className="species-list-header">
              <IonLabel>Count</IonLabel>
              <IonLabel>Species</IonLabel>
              <IonLabel>{speciesList.length}</IonLabel>
            </IonItemDivider>

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
        {isDisabled && (
          <InfoMessage>
            This record has been uploaded and can only be edited on our website.
            <IonButton
              expand="block"
              className="uploaded-message-website-link"
              href={`${config.backend.url}/sample-details?sample_id=${sample.id}`}
            >
              iRecord website
            </IonButton>
          </InfoMessage>
        )}

        <IonItemDivider>Details</IonItemDivider>
        <div className="rounded">
          <MenuAttrItemFromModel model={sample} attr="date" />
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
