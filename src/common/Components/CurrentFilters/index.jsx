import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { observer } from 'mobx-react';
import { IonToolbar, IonIcon, IonChip, IonLabel } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import './styles.scss';

const flattenFilterValuesByType = ([filterType, values]) => {
  const injectTypeBeforeValue = value => [filterType, value];
  return values.map(injectTypeBeforeValue);
};

function CurrentFilters({ searchPhrase, filters: filtersProp, removeFilter }) {
  const getFilter = ([type, value]) => {
    const removeFilterWrap = () => {
      removeFilter({ type, value });
    };

    const label = type === 'text' ? `"${value}"` : value;

    return (
      <IonChip key={value} outline onClick={removeFilterWrap}>
        <IonLabel>{label}</IonLabel>
        <IonIcon icon={closeOutline} />
      </IonChip>
    );
  };

  function getCurrentFilters() {
    const filters = Object.entries(filtersProp).flatMap(
      flattenFilterValuesByType
    );

    if (searchPhrase) {
      filters.unshift(['text', searchPhrase]);
    }

    return filters.map(getFilter);
  }

  const currentFilters = getCurrentFilters();

  if (!currentFilters.length) {
    return null;
  }

  return (
    <IonToolbar className="filterbar">
      <div>{currentFilters}</div>
    </IonToolbar>
  );
}

CurrentFilters.propTypes = exact({
  filters: PropTypes.object.isRequired,
  removeFilter: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string,
});

export default observer(CurrentFilters);
