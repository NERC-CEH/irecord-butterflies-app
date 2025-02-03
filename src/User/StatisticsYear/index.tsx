import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { chevronDownOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Page,
  Header,
  Main,
  device,
  useToast,
  useLoader,
  InfoBackgroundMessage,
  Badge,
} from '@flumens';
import { IonRefresherContent, IonRefresher } from '@ionic/react';
import species, { Species } from 'common/data/species';
import userModel from 'models/user';
import Table from './Table';
import fetchStatsService from './services';
import './styles.scss';

function useFetchStats(year: string) {
  const loader = useLoader();
  const toast = useToast();

  async function fetchStats() {
    if (!device.isOnline) {
      return;
    }

    await loader.show('Please wait...');

    try {
      const stats = await fetchStatsService(userModel, year);
      userModel.attrs.statsYears[year] = stats; // eslint-disable-line
      userModel.save();
    } catch (err: any) {
      toast.error(err);
      // do nothing
    }

    loader.hide();
  }

  return fetchStats;
}

const surveyStartyear = 2014;
const currentYear = new Date().getFullYear();
const yearsSinceStart = currentYear - surveyStartyear;
const allYears = ['all'];
for (let i = 0; i <= yearsSinceStart; i++) {
  allYears.push(`${currentYear - i}`);
}

const StatisticsYear = () => {
  const toast = useToast();
  const match = useRouteMatch<{ year?: string }>();
  const [year, setYear] = useState(match.params.year || 'all');
  const fetchStats = useFetchStats(year);

  const list = userModel.attrs.statsYears[year] || [];
  const getEntryWithSpeciesImage = (entry: any) => {
    const scientificNameWithoutSubSpecies = entry.accepted_name
      .split(' ')
      .slice(0, 2)
      .join(' ');

    // eg. Dingy skipper subSpecies (Erynis tages tages) taxon_meaning_id will be different.
    const byTaxonIdOrSubSpeciesName = (sp: Species) =>
      sp.taxonMeaningId === parseInt(entry.taxon_meaning_id, 10) ||
      sp.scientificName === scientificNameWithoutSubSpecies;
    const { thumbnail } = species.find(byTaxonIdOrSubSpeciesName) || {};

    return { ...entry, thumbnail };
  };
  const data = list.map(getEntryWithSpeciesImage);
  // const data = React.useMemo(() => list, []);

  const getReport = () => {
    if (!data.length) {
      return (
        <InfoBackgroundMessage>
          Sorry, no report data is available at the moment. Pull down to
          refresh.
        </InfoBackgroundMessage>
      );
    }

    return <Table data={data} />;
  };

  const onRefresh = async (e: any) => {
    e.detail.complete();

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    fetchStats();
  };

  const refreshStats = () => {
    fetchStats();
  };
  useEffect(refreshStats, [year]);

  const getYearSelector = () => {
    const getYearItem = (y: string) => {
      const setCurrentYear = () => setYear(y);
      const yearLabel = y === 'all' ? 'All Years' : y;
      return (
        <Badge
          key={y}
          className={clsx(
            'm-1 bg-white p-3 font-semibold',
            year === y && 'bg-primary-50'
          )}
          color={year === y ? 'primary' : undefined}
          onPress={setCurrentYear}
        >
          {yearLabel}
        </Badge>
      );
    };
    const years = allYears.map(getYearItem);

    return <div className="year-selector">{years}</div>;
  };

  return (
    <Page id="user-statistics-details">
      <Header title="Species report" />

      <Main>
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent pullingIcon={chevronDownOutline} />
        </IonRefresher>

        {getYearSelector()}

        {getReport()}

        {!!data.length && (
          <InfoBackgroundMessage className="source">
            Currently, this report only includes records that you have submitted
            through the iRecord Butterflies app and not other butterfly records
            that you have uploaded to iRecord via other routes (e.g. UKBMS).
          </InfoBackgroundMessage>
        )}
      </Main>
    </Page>
  );
};

export default observer(StatisticsYear);
