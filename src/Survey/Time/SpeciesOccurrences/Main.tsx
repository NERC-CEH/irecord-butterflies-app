import React, { FC } from 'react';
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
import { warningOutline } from 'ionicons/icons';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import { observer } from 'mobx-react';
import { Main, InfoBackgroundMessage } from '@apps';
import { Trans as T } from 'react-i18next';
import './styles.scss';

type Props = {
  sample: typeof Sample;
  samples: typeof Sample[];
  navigateToOccurrence: any;
  deleteSample: any;
};

const MainComponent: FC<Props> = ({
  sample,
  samples,
  navigateToOccurrence,
  deleteSample,
}) => {
  const isDisabled = sample.isUploaded();

  const getSamplesList = () => {
    const getOccurrence = (smp: typeof Sample) => {
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
          <IonItem detail onClick={navigateToOccurrenceWithSample}>
            <IonLabel className="time">{prettyTime}</IonLabel>
            <IonLabel>
              <IonBadge color="medium">
                <T>{stage}</T>
              </IonBadge>
            </IonLabel>
            <IonLabel slot="end">{location}</IonLabel>
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

    return samples.map(getOccurrence);
  };

  if (!samples[0]) {
    return (
      <Main id="area-count-occurrence-edit">
        <IonList id="list" lines="full">
          <InfoBackgroundMessage>No species added</InfoBackgroundMessage>
        </IonList>
      </Main>
    );
  }

  const count = samples.length > 1 ? samples.length : null;

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

          {getSamplesList()}
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
