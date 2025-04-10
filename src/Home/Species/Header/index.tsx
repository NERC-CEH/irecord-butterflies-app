import { useState } from 'react';
import { observer } from 'mobx-react';
import { searchOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonTitle,
} from '@ionic/react';
import filterOptions from 'common/data/species/filters';
import { Filter, FilterGroup } from 'models/app';
import FiltersToolbar from 'Components/FiltersToolbar';
import './styles.scss';

type Props = {
  onSearch: (e: any) => void;
  toggleFilter: (type: FilterGroup, value: Filter) => void;
  filters: any;
};

const Header = ({ onSearch, toggleFilter, filters }: Props) => {
  const [isSearching, setIsSearching] = useState(false);
  const onSearchStart = () => setIsSearching(true);
  const onSearchEnd = () => setIsSearching(false);

  return (
    <IonHeader id="species-search-header">
      {!isSearching && (
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton style={{ visibility: 'hidden' }}>
              <IonIcon slot="icon-only" icon={searchOutline} />
            </IonButton>
          </IonButtons>

          <IonTitle size="large" className="app-name">
            iRecord <b>Butterflies</b>
          </IonTitle>

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
