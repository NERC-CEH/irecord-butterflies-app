import { useContext } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import {
  mapOutline,
  warningOutline,
  clipboardOutline,
  pauseOutline,
  playOutline,
  flagOutline,
  timeOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  InfoBackgroundMessage,
  InfoMessage,
  Button,
} from '@flumens';
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonList,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonItem,
  NavContext,
} from '@ionic/react';
import VerificationListStatus from 'common/Components/VerificationListStatus';
import Sample from 'models/sample';
import DisabledRecordMessage from 'Survey/common/Components/DisabledRecordMessage';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';
import CountdownClock from './CountdownClock';
import './styles.scss';

type Props = {
  sample: Sample;
  increaseCount: any;
  deleteSpecies: (taxom: Sample) => void;
  toggleTimer: any;
};

const getDefaultTaxonCount = (taxon: any) => ({ count: 0, taxon });

const buildSpeciesCount = (agg: any, smp: Sample) => {
  const taxon = toJS(smp.occurrences[0].data.taxon);
  const id = taxon.warehouseId;

  agg[id] = agg[id] || getDefaultTaxonCount(taxon); // eslint-disable-line

  if (smp.hasZeroAbundance(taxon.id)) {
    return agg;
  }

  agg[id].count++; // eslint-disable-line
  agg[id].isGeolocating = agg[id].isGeolocating || smp.isGPSRunning(); // eslint-disable-line
  // eslint-disable-next-line
  agg[id].hasLocationMissing =
    agg[id].hasLocationMissing || smp.hasLoctionMissingAndIsnotLocating(); // eslint-disable-line

  const wasCreatedBeforeCurrent =
    new Date(agg[id].updatedOn).getTime() - new Date(smp.updatedAt).getTime();

  // eslint-disable-next-line
  agg[id].updatedOn = !wasCreatedBeforeCurrent
    ? agg[id].updatedOn
    : smp.updatedAt;

  return agg;
};

const HomeMain = ({
  sample,
  increaseCount,
  deleteSpecies,
  toggleTimer,
}: Props) => {
  const { url } = useRouteMatch();
  const { navigate } = useContext(NavContext);
  const { area } = sample.data.location || {};
  const isDisabled = sample.isUploaded;

  const timerEndTime = sample.getTimerEndTime();
  const isTimerPaused = sample.isTimerPaused();
  const isTimerFinished = sample.isTimerFinished();

  let areaPretty: any;
  if (Number.isFinite(area) || sample.isBackgroundGPSRunning()) {
    areaPretty = area ? `${area} m²` : '';
  } else if (!isDisabled) {
    areaPretty = <IonIcon icon={warningOutline} color="danger" />;
  }

  const getSpeciesEntry = ([id, species]: any) => {
    const hasZeroAbundance = sample.hasZeroAbundance(species.taxon.id);

    const { taxon } = species;

    const speciesName = taxon.commonName || taxon.scientificName;

    const increaseCountWrap = () => increaseCount(taxon);
    const increase5xCountWrap = () => increaseCount(taxon, true);

    let location;
    if (species.hasLocationMissing) {
      location = <IonIcon icon={warningOutline} color="danger" />;
    } else if (species.isGeolocating) {
      location = <IonSpinner />;
    }

    const routerLink = !hasZeroAbundance
      ? `${url}/speciesOccurrences/${taxon.warehouseId}`
      : undefined;

    const deleteSpeciesWrap = () => deleteSpecies(taxon);

    return (
      <IonItemSliding key={id} disabled={isTimerPaused}>
        <IonItem
          detail
          key={id}
          routerLink={routerLink}
          disabled={isTimerPaused}
        >
          <IncrementalButton
            onClick={increaseCountWrap}
            onLongClick={increase5xCountWrap}
            value={species.count}
            disabled={isDisabled}
          />
          <IonLabel>{speciesName}</IonLabel>
          <IonLabel slot="end" className="location-spinner">
            {location}
          </IonLabel>

          <VerificationListStatus sample={sample} key={sample.cid} />
        </IonItem>

        {!isDisabled && (
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={deleteSpeciesWrap}>
              Delete
            </IonItemOption>
          </IonItemOptions>
        )}
      </IonItemSliding>
    );
  };

  const getSpeciesList = () => {
    if (!sample.samples.length) {
      return <InfoBackgroundMessage>No species added</InfoBackgroundMessage>;
    }

    const speciesCounts = [...sample.samples].reduce(buildSpeciesCount, {});

    const counts = {
      ...speciesCounts,
    };

    const speciesList = Object.entries(counts).map(getSpeciesEntry);

    return (
      <IonList id="list" lines="full">
        <div className="rounded-list">
          <div
            className={clsx(
              'list-divider gap-4',
              isTimerPaused && 'opacity-70'
            )}
          >
            <div>
              <T>Count</T>
            </div>
            <div className="flex w-full justify-between">
              <div>
                <T>Species</T>
              </div>
              <div>{speciesList.length}</div>
            </div>
          </div>

          {speciesList}
        </div>
      </IonList>
    );
  };

  const getSpeciesAddButton = () => {
    if (isDisabled) return null;

    return (
      <Button
        color="primary"
        id="add"
        onPress={() =>
          navigate(`/survey/multi-species-count/${sample.cid}/species`)
        }
        isDisabled={isTimerPaused}
      >
        Add species
      </Button>
    );
  };

  const getTimerButton = () => {
    if (isDisabled) return null;

    let detailIcon = pauseOutline;
    if (isTimerPaused) {
      detailIcon = playOutline;
    } else if (isTimerFinished) {
      detailIcon = flagOutline;
    }

    const toggleTimerWrap = () => toggleTimer(sample);

    return (
      <>
        <IonItem
          detail={!isDisabled}
          detailIcon={detailIcon}
          onClick={toggleTimerWrap}
          disabled={isDisabled}
        >
          <IonIcon icon={timeOutline} slot="start" mode="md" />
          <IonLabel>
            <T>Duration</T>
          </IonLabel>
          <CountdownClock isPaused={isTimerPaused} countdown={timerEndTime} />
        </IonItem>
        {!isDisabled && isTimerPaused && (
          <InfoMessage color="secondary">
            To continue surveying, please restart the timer.
          </InfoMessage>
        )}
      </>
    );
  };

  return (
    <Main>
      <IonList lines="full">
        {isDisabled && (
          <div className="rounded-list mb-2">
            <DisabledRecordMessage sample={sample} />
          </div>
        )}

        <h3 className="list-title">
          <T>Details</T>
        </h3>
        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${url}/area`}
            icon={mapOutline}
            label="Area"
            value={areaPretty}
            skipValueTranslation
          />

          {getTimerButton()}

          <MenuAttrItem
            routerLink={`${url}/details`}
            icon={clipboardOutline}
            label="Survey details"
          />
        </div>
      </IonList>

      {getSpeciesAddButton()}

      {getSpeciesList()}
    </Main>
  );
};

export default observer(HomeMain);
