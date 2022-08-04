import { FC, useEffect, useState } from 'react';
import {
  Page,
  Header,
  Main,
  device,
  useToast,
  useLoader,
  InfoBackgroundMessage,
} from '@flumens';
import { observer } from 'mobx-react';
import { IonRefresherContent, IonRefresher, IonBadge } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import clsx from 'clsx';
import userModel from 'models/user';
import species, { Species } from 'common/data/species';
import Table from './Components/Table';
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

const StatisticsYear: FC = () => {
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

    const bySpeciesName = (sp: Species) =>
      sp.scientificName === scientificNameWithoutSubSpecies;
    const { thumbnail } = species.find(bySpeciesName) || {};

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
        <IonBadge
          key={y}
          className={clsx({ selected: year === y })}
          onClick={setCurrentYear}
        >
          {yearLabel}
        </IonBadge>
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
