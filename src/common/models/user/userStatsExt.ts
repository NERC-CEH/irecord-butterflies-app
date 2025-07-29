import axios, { CancelTokenSource } from 'axios';
import config from 'common/config';
import listSurveyConfig from 'Survey/List/config';
import surveyConfig from 'Survey/Point/config';
import { UserModel } from '.';

export interface UserStats {
  /**
   * count of all records for the user (unfiltered)
   */
  // myTotalRecords
  /**
   * count of all recorded species matching the filter
   */
  // projectSpeciesCount
  /**
   * ratio of user's recorded species to total recorded species matching the filter
   */
  // myProjectSpeciesRatio
  /**
   * the proportion of days on which the volunteer was active in relation to the total days he/she remained linked to the project. The time a participant is linked to the project is taken as the number of days between the first and last observation, once days outside of the summer periods are excluded.
   */
  // myProjectActivityRatio
  /**
   * taxa are ranked according to the number of records in the entire dataset from highest to lowest and scaled to 100. The most-rarely reported species has the value 100 and the most-commonly reported a value of 1: this is the species’ rarity value. The Rarity Recording metric is the median rarity value, across all records for the participant, minus the median rarity value across all observations in the dataset. Negative values of this metric show that the participant submits records of common taxa more frequently than expected, while positive values mean that the participant submits records of rarer taxa more frequently than expected.
   */
  // myProjectRarityMetric

  /**
   * count of all records matching the filter
   */
  projectRecordsCount: number;

  /**
   * count of user's recorded species matching the filter
   */
  myProjectSpecies: number;
  /**
   * count of user's recorded species matching the filter this year
   */
  myProjectSpeciesThisYear: number;
  /**
   * count of user's records matching the filter
   */
  myProjectRecords: number;
  /**
   * count of user' records matching the filter this year
   */
  myProjectRecordsThisYear: number;
}

let requestCancelToken: CancelTokenSource | undefined;

async function fetchStats(
  userModel: UserModel,
  surveyId: number[],
  onlyButterflies?: boolean
): Promise<UserStats | null> {
  console.log('Statistics: fetching user-stats');

  const filterButterflies = onlyButterflies ? '&taxon_group_id=104' : '';

  const url = `${config.backend.url}/api/v2/advanced_reports/user-stats?survey_id=${surveyId.join(',')}${filterButterflies}`;

  if (requestCancelToken) {
    requestCancelToken.cancel();
  }

  requestCancelToken = axios.CancelToken.source();

  const options = {
    headers: {
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
      'content-type': 'application/json',
    },
    timeout: 80000,
    cancelToken: requestCancelToken.token,
  };

  let res;

  try {
    res = await axios.get(url, options);
  } catch (e: any) {
    if (axios.isCancel(e)) {
      return null;
    }
    throw e;
  }

  return res.data;
}

async function fetchStatsWithButterflyFilter(
  userModel: UserModel
): Promise<UserStats | null> {
  const statsPromise = fetchStats(userModel, [
    surveyConfig.id,
    listSurveyConfig.id,
  ]);
  const butterflyStatsPromise = fetchStats(
    userModel,
    [surveyConfig.id, listSurveyConfig.id],
    true
  );

  // parallelize the requests
  const [stats, butterflyStats] = await Promise.all([
    statsPromise,
    butterflyStatsPromise,
  ]);

  if (!stats || !butterflyStats) return null;

  return {
    // species counts should be butterfly-only
    projectRecordsCount: butterflyStats.projectRecordsCount,
    myProjectSpecies: butterflyStats.myProjectSpecies,
    myProjectSpeciesThisYear: butterflyStats.myProjectSpeciesThisYear,
    // keep top level record stats for all the species
    myProjectRecords: stats.myProjectRecords,
    myProjectRecordsThisYear: stats.myProjectRecordsThisYear,
  };
}

const extension: any = {
  async fetchStats() {
    const stats = await fetchStatsWithButterflyFilter(this);
    if (!stats) return;

    this.data.stats = stats; // eslint-disable-line
    this.save();
  },

  async refreshUploadCountStat() {
    try {
      const stats = await fetchStats(this, [
        surveyConfig.id,
        listSurveyConfig.id,
      ]);
      if (!stats) return;
      // we store this temporarily because to use the stats thank you message only after upload action instead of stats page refresh
      this.uploadCounter.count = stats?.myProjectRecordsThisYear ?? 0;
    } catch (e) {
      // skip showing stats error to the user - less important than upload errors
      console.error(e);
    }
  },

  getAchievedStatsMilestone(): number | null {
    if (!this.data.lastThankYouMilestoneShown)
      this.data.lastThankYouMilestoneShown = {};

    const { lastThankYouMilestoneShown } = this.data;
    const currentYear = new Date().getFullYear();
    const lastThankYouMilestoneShownThisYear =
      lastThankYouMilestoneShown[currentYear] || 0;

    if (
      this.uploadCounter.count >= 1000 &&
      lastThankYouMilestoneShownThisYear < 1000
    )
      return 1000;
    if (
      this.uploadCounter.count >= 500 &&
      lastThankYouMilestoneShownThisYear < 500
    )
      return 500;
    if (
      this.uploadCounter.count >= 100 &&
      lastThankYouMilestoneShownThisYear < 100
    )
      return 100;
    if (
      this.uploadCounter.count >= 50 &&
      lastThankYouMilestoneShownThisYear < 50
    )
      return 50;
    if (
      this.uploadCounter.count >= 25 &&
      lastThankYouMilestoneShownThisYear < 25
    )
      return 25;

    return null;
  },
};

export default extension;
