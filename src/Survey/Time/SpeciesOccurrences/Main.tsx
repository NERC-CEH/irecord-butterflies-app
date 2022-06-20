import { FC } from 'react';
import Sample from 'models/sample';
import {
  IonList,
  IonItem,
  IonLabel,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonItemDivider,
  IonBadge,
  IonIcon,
} from '@ionic/react';
import { useRouteMatch } from 'react-router';
import { warningOutline } from 'ionicons/icons';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import { observer } from 'mobx-react';
import { Main } from '@flumens';
import { Trans as T } from 'react-i18next';
import VerificationIcon from 'common/Components/VerificationIcon';
import './styles.scss';

function byCreationDate(s1: Sample, s2: Sample) {
  const date1 = new Date(s1.metadata.updated_on);
  const date2 = new Date(s2.metadata.updated_on);

  return date2.getTime() - date1.getTime();
}

type Props = {
  sample: Sample;
  navigateToOccurrence: any;
  deleteSample: any;
};

const MainComponent: FC<Props> = ({
  sample,
  navigateToOccurrence,
  deleteSample,
}) => {
  const isDisabled = sample.isUploaded();
  const match = useRouteMatch<{ taxa: string }>();

  const warehouseId = parseInt(match.params.taxa, 10);
  const byTaxon = (smp: Sample) =>
    smp.occurrences[0].attrs.taxon.warehouseId === warehouseId;
  const occurrences = sample.samples
    .slice()
    .filter(byTaxon)
    .sort(byCreationDate);

  const getOccurrence = (smp: Sample) => {
    const occ = smp.occurrences[0];
    const prettyTime = new Date(smp.metadata.created_on)
      .toLocaleTimeString()
      .replace(/(:\d{2}| [AP]M)$/, '');

    const { stage } = occ.attrs;

    let location;
    if (smp.hasLoctionMissingAndIsnotLocating()) {
      location = <IonIcon icon={warningOutline} color="danger" />;
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
            <IonBadge color="medium">
              <T>{stage}</T>
            </IonBadge>
          </IonLabel>
          <IonLabel className="location" slot="end">
            {location}
          </IonLabel>
          <VerificationIcon occ={occ} />
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

  return (
    <Main id="area-count-occurrence-edit">
      <IonList lines="full">
        <div className="rounded">
          <IonItemDivider className="species-list-header">
            <IonLabel>
              <T>Time</T>
            </IonLabel>
            <IonLabel>
              <T>Stage</T>
            </IonLabel>
            <IonLabel>{count}</IonLabel>
          </IonItemDivider>

          {occurrencesList}
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
