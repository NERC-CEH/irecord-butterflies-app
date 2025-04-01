import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { IonList } from '@ionic/react';
import locations, { byType } from 'models/collections/locations';
import Location, { LocationType } from 'models/location';
import InfoBackgroundMessage from 'Components/InfoBackgroundMessage';
import Entry from './Entry';

type Props = {
  onSelect: any;
  selectedLocationId?: string | number;
};

const Sites = ({ onSelect, selectedLocationId }: Props) => {
  const { t } = useTranslation();

  const getEntry = (location: Location) => (
    <Entry
      key={location.cid}
      latitude={parseFloat(location.data.lat)}
      longitude={parseFloat(location.data.lon)}
      name={location.data.name}
      onClick={() => onSelect(location)}
      isSelected={location.id === selectedLocationId}
    />
  );

  const entries = locations
    .filter(byType(LocationType.GroupSite))
    .map(getEntry);

  const noLocationEntry = (
    <Entry
      name={t('Not selected')}
      onClick={() => onSelect()}
      isSelected={!selectedLocationId}
      className="h-12 opacity-60"
    />
  );

  return (
    <IonList className="mt-2 flex flex-col gap-2">
      {entries.length ? (
        <>
          {noLocationEntry}
          {entries}
        </>
      ) : (
        <InfoBackgroundMessage>
          You have no previous tracks.
        </InfoBackgroundMessage>
      )}
    </IonList>
  );
};

export default observer(Sites);
