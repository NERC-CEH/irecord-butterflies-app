import { FC, useState } from 'react';
import * as React from 'react';
import { observer } from 'mobx-react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonTitle,
} from '@ionic/react';
import { Filter, FilterGroup } from 'models/app';
import { searchOutline } from 'ionicons/icons';
import FiltersToolbar from 'Components/FiltersToolbar';
import filterOptions from 'common/data/species/filters';

const DeaultBackButton = () => (
  <IonButtons slot="start">
    <IonBackButton text="Back" data-label="back" defaultHref="/home" />
  </IonButtons>
);

type Props = {
  onSearch: (e: any) => void;
  toggleFilter: (type: FilterGroup, value: Filter) => void;
  filters: any;
  title?: string;
  BackButton?: React.ElementType;
};

const Header: FC<Props> = ({
  onSearch,
  toggleFilter,
  filters,
  BackButton = DeaultBackButton,
  title = 'Select Species',
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const onSearchStart = () => setIsSearching(true);
  const onSearchEnd = () => setIsSearching(false);

  return (
    <IonHeader id="species-search-header">
      {!isSearching && (
        <IonToolbar>
          <BackButton />

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
