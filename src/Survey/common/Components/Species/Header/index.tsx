import { FC, useState, useRef } from 'react';
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
  IonSearchbar,
  isPlatform,
} from '@ionic/react';
import clsx from 'clsx';
import { Filter, FilterGroup } from 'models/app';
import { searchOutline, checkmarkOutline } from 'ionicons/icons';
import { Keyboard } from '@capacitor/keyboard';
import CurrentFilters from 'Components/CurrentFilters';
import FiltersMenu from 'Components/FiltersMenu';
import './styles.scss';

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
  onSearch: onSearchProp,
  toggleFilter,
  filters,
  BackButton = DeaultBackButton,
  title = 'Select Species',
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [tappedSearchEnd, setTappedSearchEnd] = useState(false);
  const searchInput: any = useRef();

  function onSearch(e: any) {
    const { value } = e.detail;

    if (tappedSearchEnd) {
      return;
    }
    setSearchPhrase(value);
    onSearchProp(value);
  }

  function onSearchStart() {
    setIsSearching(true);
    setTappedSearchEnd(false);
    searchInput.current.setFocus();
  }

  function onSearchEnd() {
    setTappedSearchEnd(true);
    setIsSearching(false);
  }

  function onKeyUp({ keyCode }: { keyCode: number }) {
    // 13 = Enter
    if (keyCode === 13) {
      setIsSearching(false);
      isPlatform('hybrid') && Keyboard.hide();
    }
  }

  const addFilter = ({
    type,
    value,
  }: {
    type: FilterGroup & 'text';
    value: Filter;
  }) => {
    setSearchPhrase('');
    searchInput.current.setFocus();

    type !== 'text' && toggleFilter(type, value);
  };

  const removeFilter = ({
    type,
    value,
  }: {
    type: FilterGroup & 'text';
    value: Filter;
  }) => {
    if (type === 'text') {
      setSearchPhrase('');
      onSearchProp('');
      return;
    }

    toggleFilter(type, value);
  };

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

      <IonToolbar className={clsx('searchbar', isSearching && 'searching')}>
        <IonSearchbar
          ref={searchInput}
          onIonChange={onSearch}
          slot="end"
          showCancelButton="always"
          cancelButtonText="Done"
          cancelButtonIcon={checkmarkOutline}
          onIonCancel={onSearchEnd}
          type="search"
          enterkeyhint="done"
          onKeyUp={onKeyUp}
          placeholder="Species name or filter..."
          value={searchPhrase}
        />
      </IonToolbar>

      <CurrentFilters
        searchPhrase={searchPhrase}
        filters={filters}
        removeFilter={removeFilter}
      />

      {isSearching && (
        <FiltersMenu
          searchPhrase={searchPhrase}
          filters={filters}
          addFilter={addFilter}
        />
      )}
    </IonHeader>
  );
};

export default observer(Header);
