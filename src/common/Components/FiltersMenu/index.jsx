import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonContent, IonList, IonCol, IonRow, IonGrid } from '@ionic/react';
import species from 'common/data/species';
import Collapse from 'common/Components/Collapse';
import { observer } from 'mobx-react';
import checks from './images/checks.jpg';
import plain from './images/plain.jpg';
import spots from './images/spots.jpg';
import stripes from './images/stripes.jpg';
import './styles.scss';

const markingIllustrations = { checks, plain, spots, stripes };
const sizeLabels = {
  Small: (
    <>
      Small <small>{'(< 2cm)'}</small>
    </>
  ),
  Medium: (
    <>
      Medium <small>(2 - 4cm)</small>
    </>
  ),
  Large: (
    <>
      Large <small>{'(> 4cm)'}</small>
    </>
  ),
};

const getOptions = type => {
  const getOptionsFromSpecies = sp => sp[type];
  const hasValue = v => !!v;

  const options = species
    .flatMap(getOptionsFromSpecies)
    .filter(hasValue)
    .sort();

  const uniqueOptions = [...new Set(options)];
  return uniqueOptions;
};

const allFilters = [
  {
    type: 'colour',
    values: getOptions('colour'),
    renderValue: value => (
      <>
        <div
          style={{ background: value === 'Cream' ? '#fffdd0' : value }}
          className="colour"
        />
        {value}
      </>
    ),
  },
  {
    type: 'markings',
    values: getOptions('markings'),
    renderValue: value => (
      <>
        <img src={markingIllustrations[value.toLowerCase()]} />
        {value}
      </>
    ),
  },
  {
    type: 'size',
    values: getOptions('size'),
    renderValue: value => sizeLabels[value],
  },
  { type: 'group', values: getOptions('group') },
  { type: 'country', values: getOptions('country') },
];

function FiltersMenu({ searchPhrase, filters, addFilter }) {
  const getFilterType = ({ type, values, renderValue }) => {
    let options = [...values];

    const notSelected = value =>
      !filters[type] || !filters[type].includes(value);
    const matchesSearchString = value =>
      searchPhrase
        ? value.toLowerCase().includes(searchPhrase.toLowerCase())
        : true;

    options = options.filter(notSelected).filter(matchesSearchString);

    if (!options.length) {
      return null;
    }

    const getOption = value => {
      const toggleFilterWrap = () => {
        addFilter({ type, value });
      };

      const filterLabel = renderValue ? renderValue(value) : value;

      return (
        <IonCol key={value} size="6" lines="none" onClick={toggleFilterWrap}>
          {filterLabel}
        </IonCol>
      );
    };

    const filterTypeOptions = options.map(getOption);

    return (
      <Collapse key={type} title={type} open={!!searchPhrase}>
        <IonGrid>
          <IonRow>{filterTypeOptions}</IonRow>
        </IonGrid>
      </Collapse>
    );
  };

  const filterTypes = allFilters.map(getFilterType);

  const hasFilters = !!filterTypes.find(filter => filter);
  if (!hasFilters) {
    return null;
  }

  return (
    <IonContent slot="fixed" className="filters">
      <IonList>{filterTypes}</IonList>
    </IonContent>
  );
}

FiltersMenu.propTypes = exact({
  filters: PropTypes.object.isRequired,
  addFilter: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string,
});

export default observer(FiltersMenu);
