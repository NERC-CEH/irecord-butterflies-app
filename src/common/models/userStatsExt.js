import config from 'common/config';
import axios from 'axios';
import surveyConfig from 'Survey/Point/config';

let requestCancelToken;

async function fetchStats(userModel) {
  console.log('Statistics: fetching user-stats');

  const url = `${config.backend.url}/api/v1/advanced_reports/user-stats?survey_id=${surveyConfig.id}`;
  const userAuth = btoa(`${userModel.attrs.email}:${userModel.attrs.password}`);

  if (requestCancelToken) {
    requestCancelToken.cancel();
  }

  requestCancelToken = axios.CancelToken.source();

  const options = {
    headers: {
      'x-api-key': config.backend.apiKey,
      authorization: `Basic ${userAuth}`,
      'content-type': 'application/json',
    },
    timeout: 80000,
    cancelToken: requestCancelToken.token,
  };

  let res;

  try {
    res = await axios.get(url, options);
  } catch (e) {
    if (axios.isCancel(e)) {
      return null;
    }

    throw e;
  }

  return res.data;
}

const extension = {
  async fetchStats() {
    const stats = await fetchStats(this);
    if (!stats) return;

    this.attrs.stats = stats; // eslint-disable-line

    this.save();
  },

  async refreshUploadCountStat() {
    try {
      await this.fetchStats();
      // we store this temporarily because to use the stats thank you message only after upload action instead of stats page refresh
      this.uploadCounter.count = this.attrs?.stats?.myProjectRecordsThisYear;
    } catch (e) {
      // skip showing stats error to the user - less important than upload errors
      console.error(e);
    }
  },

  getAchievedStatsMilestone() {
    const { lastThankYouMilestoneShown } = this.attrs;

    if (this.uploadCounter.count >= 1000 && lastThankYouMilestoneShown < 1000)
      return 1000;
    if (this.uploadCounter.count >= 500 && lastThankYouMilestoneShown < 500)
      return 500;
    if (this.uploadCounter.count >= 100 && lastThankYouMilestoneShown < 100)
      return 100;
    if (this.uploadCounter.count >= 50 && lastThankYouMilestoneShown < 50)
      return 50;
    if (this.uploadCounter.count >= 25 && lastThankYouMilestoneShown < 25)
      return 25;

    return null;
  },
};

export { extension as default };
