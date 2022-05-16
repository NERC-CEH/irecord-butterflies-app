import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {
  Page,
  Header,
  Main,
  device,
  useToast,
  useLoader,
  InfoBackgroundMessage,
} from '@apps';
import { observer } from 'mobx-react';
import { IonRefresherContent, IonRefresher, IonBadge } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import clsx from 'clsx';
import Table from './Components/Table';
import fetchStats from './services';
import './styles.scss';

async function fetchStatsWrap(userModel, year, loader) {
  if (!device.isOnline) {
    return;
  }

  await loader.show('Please wait...');

  try {
    const stats = await fetchStats(userModel, year);
    userModel.attrs.statsYears[year] = stats; // eslint-disable-line
    userModel.save();
  } catch (err) {
    console.error(err);
    // do nothing
  }

  loader.hide();
}

const surveyStartyear = 2014;
const currentYear = new Date().getFullYear();
const yearsSinceStart = currentYear - surveyStartyear;
const allYears = ['all'];
for (let i = 0; i <= yearsSinceStart; i++) {
  allYears.push(`${currentYear - i}`);
}

function StatisticsYear({ userModel }) {
  const loader = useLoader();
  const toast = useToast();
  const match = useRouteMatch();
  const [year, setYear] = useState(match.params.year || 'all');

  const list = userModel.attrs.statsYears[year] || [];
  const data = list;
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

  const onRefresh = async event => {
    event.detail.complete();

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    fetchStatsWrap(userModel, year, loader);
  };

  const refreshStats = () => fetchStatsWrap(userModel, year, loader);
  useEffect(refreshStats, [year]);

  const getYearSelector = () => {
    const getYearItem = y => {
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
}

StatisticsYear.propTypes = exact({
  userModel: PropTypes.object.isRequired,
});

export default observer(StatisticsYear);
