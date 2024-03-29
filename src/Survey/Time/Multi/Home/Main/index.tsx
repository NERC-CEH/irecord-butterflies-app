import { FC } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Sample from 'models/sample';
import {
  Main,
  MenuAttrItem,
  InfoBackgroundMessage,
  InfoMessage,
} from '@flumens';
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonList,
  IonItemDivider,
  IonIcon,
  IonButton,
  IonLabel,
  IonSpinner,
  IonItem,
} from '@ionic/react';
import config from 'common/config';
import { Trans as T } from 'react-i18next';
import { mapOutline, warningOutline, clipboardOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import Stopwatch from 'Survey/Time/common/Components/Stopwatch';
import VerificationListIcon from 'common/Components/VerificationListIcon';
import IncrementalButton from 'Survey/common/Components/IncrementalButton';
import './styles.scss';

type Props = {
  sample: Sample;
  increaseCount: any;
  deleteSpecies: (taxom: Sample) => void;
};

const getDefaultTaxonCount = (taxon: any) => ({ count: 0, taxon });

const buildSpeciesCount = (agg: any, smp: Sample) => {
  const taxon = toJS(smp.occurrences[0].attrs.taxon);
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
    new Date(agg[id].updatedOn).getTime() -
    new Date(smp.metadata.updated_on).getTime();

  // eslint-disable-next-line
  agg[id].updatedOn = !wasCreatedBeforeCurrent
    ? agg[id].updatedOn
    : smp.metadata.updated_on;

  return agg;
};

const HomeMain: FC<Props> = ({ sample, increaseCount, deleteSpecies }) => {
  const { url } = useRouteMatch();
  const { area } = sample.attrs.location || {};
  const isDisabled = sample.isUploaded();
  const isTimerPaused = sample.isTimerPaused();

  let areaPretty: JSX.Element | string = (
    <IonIcon icon={warningOutline} color="danger" />
  );

  if (Number.isFinite(area) || sample.isBackgroundGPSRunning()) {
    areaPretty = area ? `${area} m²` : '';
  }

  const getSpeciesEntry = ([id, species]: any) => {
    const hasZeroAbundance = sample.hasZeroAbundance(species.taxon.id);

    const { taxon } = species;

    const speciesName = taxon.commonName;

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

          <VerificationListIcon sample={sample} key={sample.cid} />
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
      return (
        <IonList id="list" lines="full">
          <InfoBackgroundMessage>No species added</InfoBackgroundMessage>
        </IonList>
      );
    }

    const speciesCounts = [...sample.samples].reduce(buildSpeciesCount, {});

    const counts = {
      ...speciesCounts,
    };

    const speciesList = Object.entries(counts).map(getSpeciesEntry);

    return (
      <IonList id="list" lines="full">
        <div className="rounded">
          <IonItemDivider className="species-list-header">
            <IonLabel>Count</IonLabel>
            <IonLabel>Species</IonLabel>
            <IonLabel slot="end">{speciesList.length}</IonLabel>
          </IonItemDivider>

          {speciesList}
        </div>
      </IonList>
    );
  };

  const getSpeciesAddButton = () => {
    if (isDisabled) return null;

    return (
      <IonButton
        color="primary"
        id="add"
        routerLink={`/survey/multi-species-count/${sample.cid}/species`}
        disabled={isTimerPaused}
      >
        <IonLabel>Add species</IonLabel>
      </IonButton>
    );
  };

  return (
    <Main>
      {isDisabled && (
        <InfoMessage>
          This record has been uploaded and can only be edited on our website.
          <IonButton
            expand="block"
            className="uploaded-message-website-link"
            href={`${config.backend.url}`}
          >
            iRecord website
          </IonButton>
        </InfoMessage>
      )}

      <IonList lines="full">
        <IonItemDivider>
          <T>Details</T>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${url}/area`}
            icon={mapOutline}
            label="Area"
            value={areaPretty}
            skipValueTranslation
          />

          <Stopwatch sample={sample} />
          {isTimerPaused && (
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

      {getSpeciesAddButton()}

      {getSpeciesList()}
    </Main>
  );
};

export default observer(HomeMain);
