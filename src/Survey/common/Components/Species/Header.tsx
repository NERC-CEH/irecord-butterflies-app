import { useState } from 'react';
import { observer } from 'mobx-react';
import { searchOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonTitle,
} from '@ionic/react';
import filterOptions from 'common/data/species/filters';
import { Filter, FilterGroup } from 'models/app';
import FiltersToolbar from 'Components/FiltersToolbar';

const DefaultBackButton = () => (
  <IonButtons slot="start">
    <IonBackButton text="Back" data-label="back" defaultHref="/home" />
  </IonButtons>
);

type Props = {
  onSearch: (e: any) => void;
  toggleFilter: (type: FilterGroup, value: Filter) => void;
  filters: any;
  title?: string;
  onCancel?: any;
};

const Header = ({
  onSearch,
  toggleFilter,
  filters,
  onCancel,
  title = 'Select Species',
}: Props) => {
  const [isSearching, setIsSearching] = useState(false);
  const onSearchStart = () => setIsSearching(true);
  const onSearchEnd = () => setIsSearching(false);

  const backButton = !onCancel ? (
    <DefaultBackButton />
  ) : (
    <IonButtons slot="start" onClick={onCancel}>
      <IonButton color="dark">Cancel</IonButton>
    </IonButtons>
  );

  return (
    <IonHeader id="species-search-header">
      {!isSearching && (
        <IonToolbar>
          {backButton}

          <IonTitle>{title}</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={onSearchStart}>
              <IonIcon slot="icon-only" icon={searchOutline} color="dark" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      )}

      <FiltersToolbar
        options={filterOptions}
        isOpen={isSearching}
        values={filters}
        toggleFilter={toggleFilter}
        onSearch={onSearch}
        onSearchEnd={onSearchEnd}
      />
    </IonHeader>
  );
};

export default observer(Header);
