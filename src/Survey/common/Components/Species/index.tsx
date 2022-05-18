import { FC, useContext, useState, useEffect } from 'react';
import * as React from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import appModel, { Filters, Filter, FilterGroup } from 'models/app';
import { NavContext } from '@ionic/react';
import { Page, useAlert } from '@flumens';
import { observer } from 'mobx-react';
import Main from 'common/Components/SpeciesList';
import { Species } from 'common/data/species';
import Header from './Header';

type Props = {
  sample: Sample;
  occurrence: Occurrence;
  title?: string;
  BackButton?: React.ElementType;
};

function useTimeSurveyTip() {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  const showTip = () =>
    alert({
      header: 'Timed count',
      message: (
        <>
          <p>
            Use this feature for timed counts of priority species. Select the
            species and life stage and provide a site name. Weather details
            should be added automatically or you can add them manually. During
            the survey, tap the Count each time you see the target species. The
            app will track the time and route.
          </p>
          <p>
            Such surveys may contribute to UK Butterfly Monitoring Scheme
            trends.
          </p>
        </>
      ),
      buttons: [
        {
          text: 'More Information',
          cssClass: 'primary',
          role: 'cancel',

          handler: () => {
            navigate('/info/faq', 'root');
          },
        },
        { text: 'OK' },
      ],
    });

  return showTip;
}

const SpeciesSelect: FC<Props> = ({
  sample,
  occurrence,
  title,
  BackButton,
}) => {
  const { navigate, goBack } = useContext(NavContext);
  const showTimeSurveyTip = useTimeSurveyTip();

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

  const getSpeciesID = (occ: Occurrence) => (occ.attrs.taxon || {}).id;
  const currentSpecies = sample.occurrences.map(getSpeciesID);

  const toggleFilter = (type: FilterGroup, value: Filter) => {
    if (type === 'survey') {
      // this only belongs in memory and reset for each survey
      setSurveyFilters(null);
      return;
    }
    appModel.toggleFilter(type, value);
  };

  const showTimeSurveyTipOnce = () => {
    if (
      sample.isSurveySingleSpeciesTimedCount() &&
      appModel.attrs.showTimeSurveyTip
    ) {
      appModel.attrs.showTimeSurveyTip = false; // eslint-disable-line
      appModel.save();
      showTimeSurveyTip();
    }
  };
  useEffect(showTimeSurveyTipOnce);

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
