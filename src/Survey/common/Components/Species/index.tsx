import React, { FC, useContext, useState } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import appModel from 'models/app';
import { Filters } from 'models/app.d';
import { NavContext } from '@ionic/react';
import { Page } from '@apps';
import { observer } from 'mobx-react';
import Main from 'common/Components/SpeciesList';
import { Species } from 'common/data/species';
import Header from './Header';

type Props = {
  sample: typeof Sample;
  occurrence: typeof Occurrence;
  title?: string;
  BackButton?: React.ElementType;
};

const SpeciesSelect: FC<Props> = ({
  sample,
  occurrence,
  title,
  BackButton,
}) => {
  const { navigate, goBack } = useContext(NavContext);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [surveyFilters, setSurveyFilters] = useState<Filters | null>(
    sample.getSurveySpeciesFilters()
  );

  const filters = { ...surveyFilters, ...appModel.attrs.filters };

  function onSelect(species: Species) {
    const navNextPath = sample.setSpecies(species, occurrence);
    sample.save();

    if (navNextPath) {
      navigate(navNextPath, 'forward', 'pop');
      return;
    }

    goBack();
  }

  const getSpeciesID = (occ: typeof Occurrence) => (occ.attrs.taxon || {}).id;
  const currentSpecies = sample.occurrences.map(getSpeciesID);

  const toggleFilter = (type: string, value: string) => {
    if (type === 'survey') {
      // this only belongs in memory and reset for each survey
      setSurveyFilters(null);
      return;
    }
    appModel.toggleFilter(type, value);
  };

  return (
    <Page id="species-attr">
      <Header
        onSearch={setSearchPhrase}
        toggleFilter={toggleFilter}
        filters={filters}
        BackButton={BackButton}
        title={title}
      />
      <Main
        onSelect={onSelect}
        searchPhrase={searchPhrase}
        filters={filters}
        ignore={currentSpecies}
      />
    </Page>
  );
};

export default observer(SpeciesSelect);
