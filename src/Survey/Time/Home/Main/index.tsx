import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Sample from 'models/sample';
import { Main, MenuAttrItem, InfoBackgroundMessage } from '@apps';
import {
  IonImg,
  IonList,
  IonItemDivider,
  IonIcon,
  IonButton,
  IonLabel,
  NavContext,
  IonSpinner,
  IonItem,
} from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { mapOutline, warningOutline, clipboardOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import Stopwatch from 'Survey/Time/Components/Stopwatch';
import UKBMSlogo from './UKBMSlogo.png';
import './styles.scss';

type Props = {
  sample: typeof Sample;
  increaseCount: any;
};

const getDefaultTaxonCount = (taxon: any) => ({ count: 0, taxon });

const buildSpeciesCount = (agg: any, smp: typeof Sample) => {
  const taxon = toJS(smp.occurrences[0].attrs.taxon);
  const id = taxon.warehouseId;

  agg[id] = agg[id] || getDefaultTaxonCount(taxon); // eslint-disable-line

  if (smp.hasZeroAbundance()) {
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

const HomeMain: FC<Props> = ({ sample, increaseCount }) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const { area } = sample.attrs.location || {};

  let areaPretty: JSX.Element | string = (
    <IonIcon icon={warningOutline} color="danger" />
  );

  if (Number.isFinite(area) || sample.isBackgroundGPSRunning()) {
    areaPretty = area ? `${area} m²` : '';
  }

  const getSpeciesEntry = ([id, species]: any) => {
    const hasZeroAbundance = sample.hasZeroAbundance();

    const isSpeciesDisabled = !species.count;
    const { taxon } = species;

    const speciesName = taxon.commonName;

    // const isShallow = !species.count;
    const increaseCountWrap = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      increaseCount(taxon);
    };

    const navigateToSpeciesOccurrences = () =>
      !hasZeroAbundance &&
      navigate(`${url}/speciesOccurrences/${taxon.warehouseId}`);

    let location;
    if (species.hasLocationMissing) {
      location = <IonIcon icon={warningOutline} color="danger" />;
    } else if (species.isGeolocating) {
      location = <IonSpinner />;
    }

    return (
      <IonItem
        key={id}
        detail={!isSpeciesDisabled && !hasZeroAbundance}
        onClick={navigateToSpeciesOccurrences}
      >
        <IonButton
          className="precise-area-count-edit-count"
          onClick={increaseCountWrap}
          fill="clear"
        >
          {species.count}
          <div className="label-divider" />
        </IonButton>
        <IonLabel>{speciesName}</IonLabel>
        <IonLabel slot="end" className="location-spinner">
          {location}
        </IonLabel>
      </IonItem>
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
      <>
        <IonList id="list" lines="full">
          <div className="rounded">
            <IonItemDivider className="species-list-header">
              <IonLabel>Count</IonLabel>
              <IonLabel>Species</IonLabel>
            </IonItemDivider>

            {speciesList}
          </div>
        </IonList>
      </>
    );
  };

  return (
    <Main>
      <IonImg src={UKBMSlogo} />
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
