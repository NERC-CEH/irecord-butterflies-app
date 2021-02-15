import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonTitle,
  IonSearchbar,
} from '@ionic/react';
import clsx from 'clsx';
import { searchOutline } from 'ionicons/icons';
import './styles.scss';

function Header({ onSearch: onSearchProp }) {
  const [isSearching, setIsSearching] = useState(false);
  const searchInput = useRef();

  function onSearch(e) {
    onSearchProp(e.detail.value);
  }

  function onSearchStart() {
    setIsSearching(true);
    searchInput.current.setFocus();
  }
  function onSearchEnd() {
    setIsSearching(false);
    onSearchProp();
  }

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
          onIonCancel={onSearchEnd}
        />
      </IonToolbar>
    </IonHeader>
  );
}

Header.propTypes = exact({
  onSearch: PropTypes.func.isRequired,
});

export default Header;
