import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { mapOutline, warningOutline, clipboardOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  InfoBackgroundMessage,
  InfoMessage,
} from '@flumens';
import {
  IonImg,
  IonList,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonItem,
} from '@ionic/react';
import VerificationListStatus from 'common/Components/VerificationListStatus';
import UKBMSlogo from 'common/images/UKBMSlogo.png';
import Sample from 'models/sample';
import DisabledRecordMessage from 'Survey/common/Components/DisabledRecordMessage';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';
import Stopwatch from './Stopwatch';
import './styles.scss';

type Props = {
  sample: Sample;
  increaseCount: any;
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
  agg[id].isGeolocating = agg[id].isGeolocating || smp.isBackgroundGPSRunning(); // eslint-disable-line
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

const HomeMain = ({ sample, increaseCount }: Props) => {
  const { url } = useRouteMatch();
  const { area } = sample.data.location || {};
  const isDisabled = sample.isUploaded;
  const isTimerPaused = sample.isTimerPaused();

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
      if (!isDisabled) {
        location = <IonIcon icon={warningOutline} color="danger" />;
      }
    } else if (species.isGeolocating) {
      location = <IonSpinner />;
    }

    const routerLink = !hasZeroAbundance
      ? `${url}/speciesOccurrences/${taxon.warehouseId}`
      : undefined;

    return (
      <IonItem key={id} routerLink={routerLink} disabled={isTimerPaused}>
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
            </div>
          </div>

          {speciesList}
        </div>
      </IonList>
    );
  };

  return (
    <Main>
      <IonImg src={UKBMSlogo} />
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

          <Stopwatch sample={sample} />
          {!isDisabled && isTimerPaused && (
            <InfoMessage color="secondary">
              To continue surveying, please restart the timer.
            </InfoMessage>
          )}

          <MenuAttrItem
            routerLink={`${url}/details`}
            icon={clipboardOutline}
            label="Survey details"
          />
        </div>
      </IonList>

      {getSpeciesList()}
    </Main>
  );
};

export default observer(HomeMain);
