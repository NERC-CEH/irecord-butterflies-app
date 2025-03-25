import { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  locationToGrid,
  Page,
  useAlert,
  useOnBackButton,
  useSample,
} from '@flumens';
import { NavContext } from '@ionic/react';
import Main from 'common/Components/SpeciesList';
import { Species } from 'common/data/species';
import appModel, { Filters, Filter, FilterGroup } from 'models/app';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import getCurrentWeekNumber from 'helpers/weeks';
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
            navigate('/info/faq', 'root', 'replace');
          },
        },
      ],
    });

  return showTip;
}

const SpeciesSelect = ({ title, showCancelButton, onSelect }: Props) => {
  const { navigate, goBack } = useContext(NavContext);
  const showTimeSurveyTip = useTimeSurveyTip();

  const { sample, occurrence } = useSample<Sample, Occurrence>();

  const location = JSON.parse(JSON.stringify(sample?.data.location || {}));
  location.accuracy = 1000000; // make it hectad
  location.gridref = locationToGrid(location); // eslint-disable-line
  const hectad = location.gridref;

  const week = getCurrentWeekNumber(sample?.data.date);

  const getIdentifiedSpeciesList = () => {
    if (!occurrence && sample!.getSurvey().name === 'point')
      return sample?.occurrences[0]?.getAllUniqueIdentifiedSpecies();

    if (!occurrence && sample?.getSurvey().name === 'list') return [];

    if (!occurrence) return [];

    return occurrence.getAllUniqueIdentifiedSpecies();
  };

  const identifiedSpeciesList = getIdentifiedSpeciesList();

  const alert = useAlert();
  const [isAlertPresent, setIsAlertPresent] = useState(false);

  const shouldDeleteSurvey = useDeleteSurveyPrompt(alert);
  const isSurveySingleSpeciesTimedCount =
    sample?.isSurveySingleSpeciesTimedCount();

  const onDeleteSurvey = async () => {
    if (!isSurveySingleSpeciesTimedCount || isAlertPresent) {
      goBack();
      return;
    }

    setIsAlertPresent(true);

    const change = await shouldDeleteSurvey();
    if (change) {
      await sample!.destroy();
      setIsAlertPresent(false);
      navigate('/home/surveys', 'root', 'push', undefined, {
        unmount: true,
      });
      return;
    }

    setIsAlertPresent(false);
  };

  useOnBackButton(onDeleteSurvey);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [surveyFilters, setSurveyFilters] = useState<Filters | null>(
    sample!.getSurveySpeciesFilters()
  );

  const filters = { ...surveyFilters, ...appModel.data.filters };

  async function onSelectDefault(species: Species) {
    const navNextPath = await sample!.setSpecies(species, occurrence!);
    sample!.save();

    if (navNextPath) {
      navigate(navNextPath, 'forward', 'push', undefined, {
        unmount: true,
      });
      return;
    }

    goBack();
  }

  const getSpeciesID = (occ: Occurrence) => (occ.data.taxon || {}).id;
  const getSampleSpeciesID = (smp: Sample) => smp.occurrences[0].data.taxon.id;
  const currentSpecies = sample?.isSurveyMultiSpeciesTimedCount()
    ? sample!.samples.map(getSampleSpeciesID)
    : sample?.occurrences.map(getSpeciesID);

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
      sample!.isSurveySingleSpeciesTimedCount() &&
      appModel.data.showTimeSurveyTip
    ) {
      appModel.data.showTimeSurveyTip = false; // eslint-disable-line
      appModel.save();
      showTimeSurveyTip();
    }
  };
  useEffect(showTimeSurveyTipOnce);

  if (!sample) return null;

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
        week={week}
        hectad={hectad}
        identifiedSpeciesList={identifiedSpeciesList}
      />
    </Page>
  );
};

export default observer(SpeciesSelect);
