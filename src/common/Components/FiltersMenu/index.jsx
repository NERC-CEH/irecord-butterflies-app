import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonContent, IonList, IonCol, IonRow, IonGrid } from '@ionic/react';
import species from 'common/data/species';
import Collapse from 'common/Components/Collapse';
import './styles.scss';

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
  { type: 'colour', values: getOptions('colour') },
  { type: 'markings', values: getOptions('markings') },
  { type: 'size', values: getOptions('size') },
  { type: 'group', values: getOptions('group') },
  { type: 'country', values: getOptions('country') },
];

function FiltersMenu({ searchPhrase, filters, addFilter }) {
  function getFilters() {
    const getFilterType = ({ type, values }) => {
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

        return (
          <IonCol key={value} size="6" lines="none" onClick={toggleFilterWrap}>
            {value}
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

    return <IonList>{filterTypes}</IonList>;
  }

  return (
    <IonContent slot="fixed" className="filters">
      {getFilters()}
    </IonContent>
  );
}

FiltersMenu.propTypes = exact({
  filters: PropTypes.object.isRequired,
  addFilter: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string,
});

export default FiltersMenu;
