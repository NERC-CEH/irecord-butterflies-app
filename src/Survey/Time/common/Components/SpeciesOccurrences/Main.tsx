import { observer } from 'mobx-react';
import { warningOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, InfoBackgroundMessage, Badge } from '@flumens';
import {
  IonList,
  IonItem,
  IonLabel,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonIcon,
} from '@ionic/react';
import VerificationStatus from 'common/Components/VerificationStatus';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import './styles.scss';

function byCreationDate(s1: Sample, s2: Sample) {
  const date1 = new Date(s1.updatedAt);
  const date2 = new Date(s2.updatedAt);

  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: Sample;
  samples: any;
  navigateToOccurrence: any;
  deleteSample: any;
};

const MainComponent = ({
  sample,
  navigateToOccurrence,
  deleteSample,
  samples,
}: Props) => {
  const isDisabled = sample.isUploaded;
  const match = useRouteMatch<{ taxa: string }>();

  const warehouseId = parseInt(match.params.taxa, 10);
  const byTaxon = (smp: Sample) =>
    smp.occurrences[0].data.taxon.warehouseId === warehouseId;
  const occurrences = sample.samples
    .slice()
    .filter(byTaxon)
    .sort(byCreationDate);

  const getOccurrence = (smp: Sample) => {
    const occ = smp.occurrences[0];
    const prettyTime = new Date(smp.createdAt)
      .toLocaleTimeString()
      .replace(/(:\d{2}| [AP]M)$/, '');

    const { stage } = occ.data;

    let location;
    if (smp.hasLoctionMissingAndIsnotLocating()) {
      if (!isDisabled) {
        location = <IonIcon icon={warningOutline} color="danger" />;
      }
    } else {
      location = <GridRefValue sample={smp} />;
    }

    const navigateToOccurrenceWithSample = () => navigateToOccurrence(smp);

    const deleteSubSample = () => deleteSample(smp);

    return (
      <IonItemSliding key={smp.cid}>
        <IonItem
          detail={!occ.hasOccurrenceBeenVerified()}
          onClick={navigateToOccurrenceWithSample}
        >
          <IonLabel className="time">{prettyTime}</IonLabel>
          <IonLabel className="stage">
            <Badge>{stage}</Badge>
          </IonLabel>
          <IonLabel className="location" slot="end">
            {location}
          </IonLabel>
          <VerificationStatus occ={occ} />
        </IonItem>
        {!isDisabled && (
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={deleteSubSample}>
              <T>Delete</T>
            </IonItemOption>
          </IonItemOptions>
        )}
      </IonItemSliding>
    );
  };

  const occurrencesList = occurrences.map(getOccurrence);

  const count = occurrencesList.length > 1 ? occurrencesList.length : null;

  if (!samples[0]) {
    return (
      <Main id="area-count-occurrence-edit">
        <InfoBackgroundMessage>No species added</InfoBackgroundMessage>
      </Main>
    );
  }
  const species = samples[0].occurrences[0].data.taxon.commonName;

  return (
    <Main id="area-count-occurrence-edit">
      <IonList lines="full">
        {sample.isSurveyMultiSpeciesTimedCount() && (
          <div className="rounded-list">
            <MenuAttrItem
              routerLink={`${match.url}/taxon`}
              disabled={isDisabled}
              icon={butterflyIcon}
              label="Species"
              value={species}
            />
          </div>
        )}

        <div className="rounded-list mt-5">
          <div className="list-divider gap-10">
            <div>
              <T>Time</T>
            </div>
            <div className="flex w-full justify-between">
              <div>
                <T>Stage</T>
              </div>
              <div>{count}</div>
            </div>
          </div>

          {occurrencesList}
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
