import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
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
import { searchOutline, checkmarkOutline } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import CurrentFilters from 'Components/CurrentFilters';
import FiltersMenu from 'Components/FiltersMenu';

import './styles.scss';

const { Keyboard } = Plugins;

function Header({ onSearch: onSearchProp, toggleFilter, filters }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [tappedSearchEnd, setTappedSearchEnd] = useState(false);
  const searchInput = useRef();

  function onSearch(e) {
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

  function onKeyUp({ keyCode }) {
    // 13 = Enter
    if (keyCode === 13) {
      setIsSearching(false);
      isPlatform('hybrid') && Keyboard.hide();
    }
  }

  const addFilter = ({ type, value }) => {
    setSearchPhrase('');
    searchInput.current.setFocus();

    type !== 'text' && toggleFilter(type, value);
  };

  const removeFilter = ({ type, value }) => {
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
          <IonButtons slot="start">
            <IonBackButton text="Back" data-label="back" defaultHref="/home" />
          </IonButtons>

          <IonTitle>Select Species</IonTitle>

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
}

Header.propTypes = exact({
  onSearch: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
});

export default observer(Header);
