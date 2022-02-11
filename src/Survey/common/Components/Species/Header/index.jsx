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
import { Keyboard } from '@capacitor/keyboard';
import CurrentFilters from 'Components/CurrentFilters';
import FiltersMenu from 'Components/FiltersMenu';
import CancelBackButton from '../../CancelBackButton';
import './styles.scss';

function Header({
  onSearch: onSearchProp,
  toggleFilter,
  filters,
  isSurveySingleSpeciesTimedCount,
  sample,
}) {
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

  const title = isSurveySingleSpeciesTimedCount
    ? 'Select target species'
    : 'Select Species';

  return (
    <IonHeader id="species-search-header">
      {!isSearching && (
        <IonToolbar>
          {!isSurveySingleSpeciesTimedCount && (
            <IonButtons slot="start">
              <IonBackButton
                text="Back"
                data-label="back"
                defaultHref="/home"
              />
            </IonButtons>
          )}

          {isSurveySingleSpeciesTimedCount && (
            <CancelBackButton sample={sample} />
          )}

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
}

Header.propTypes = exact({
  onSearch: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  isSurveySingleSpeciesTimedCount: PropTypes.bool,
  sample: PropTypes.object,
});

export default observer(Header);
