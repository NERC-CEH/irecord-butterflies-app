import { FC, useContext, useState, useEffect } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import appModel, { Filters, Filter, FilterGroup } from 'models/app';
import { NavContext } from '@ionic/react';
import { Page, useAlert, useOnBackButton } from '@flumens';
import { observer } from 'mobx-react';
import Main from 'common/Components/SpeciesList';
import { Species } from 'common/data/species';
import Header from './Header';

function useDeleteSurveyPrompt(alert: any) {
  const deleteSurveyPromt = (resolve: (param: boolean) => void) => {
    alert({
      header: 'Delete Survey',
      message:
        'Warning - This will discard the survey information you have entered so far.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => resolve(false),
        },
        {
          text: 'Discard',
          role: 'destructive',
          handler: () => resolve(true),
        },
      ],
    });
  };

  const deleteSurveyPromtWrap = () => new Promise(deleteSurveyPromt);

  return deleteSurveyPromtWrap;
}

type Props = {
  sample: Sample;
  occurrence: Occurrence;
  title?: string;
  showCancelButton?: any;
  onSelect?: (species: Species) => void;
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
        { text: 'OK', role: 'cancel' },
        {
          text: 'More Information',
          cssClass: 'primary',

          handler: () => {
            navigate('/info/faq', 'root');
          },
        },
      ],
    });

  return showTip;
}

const SpeciesSelect: FC<Props> = ({
  sample,
  occurrence,
  title,
  showCancelButton,
  onSelect,
}) => {
  const { navigate, goBack } = useContext(NavContext);
  const showTimeSurveyTip = useTimeSurveyTip();

  const sampleGridRef = sample.attrs.location?.gridref?.slice(0, 4);
  const { media } = sample.occurrences[0];

  const alert = useAlert();
  const [isAlertPresent, setIsAlertPresent] = useState(false);

  const shouldDeleteSurvey = useDeleteSurveyPrompt(alert);
  const isSurveySingleSpeciesTimedCount =
    sample.isSurveySingleSpeciesTimedCount();

  const onDeleteSurvey = async () => {
    if (!isSurveySingleSpeciesTimedCount || isAlertPresent) {
      goBack();
      return;
    }

    setIsAlertPresent(true);

    const change = await shouldDeleteSurvey();
    if (change) {
      await sample.destroy();
      setIsAlertPresent(false);
      navigate('/home/surveys', 'root', 'pop');
      return;
    }

    setIsAlertPresent(false);
  };

  useOnBackButton(onDeleteSurvey);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [surveyFilters, setSurveyFilters] = useState<Filters | null>(
    sample.getSurveySpeciesFilters()
  );

  const filters = { ...surveyFilters, ...appModel.attrs.filters };

  function onSelectDefault(species: Species) {
    const navNextPath = sample.setSpecies(species, occurrence);
    sample.save();

    if (navNextPath) {
      navigate(navNextPath, 'forward', 'pop');
      return;
    }

    goBack();
  }

  const getSpeciesID = (occ: Occurrence) => (occ.attrs.taxon || {}).id;
  const getSampleSpeciesID = (smp: Sample) => smp.occurrences[0].attrs.taxon.id;
  const currentSpecies = sample.isSurveyMultiSpeciesTimedCount()
    ? sample.samples.map(getSampleSpeciesID)
    : sample.occurrences.map(getSpeciesID);

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
        onCancel={showCancelButton ? onDeleteSurvey : undefined}
        title={title}
      />
      <Main
        onSelect={onSelect || onSelectDefault}
        searchPhrase={searchPhrase}
        filters={filters}
        ignore={currentSpecies}
        sampleGridRef={sampleGridRef}
        media={media}
      />
    </Page>
  );
};

export default observer(SpeciesSelect);
