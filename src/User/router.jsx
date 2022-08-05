import { Route } from 'react-router-dom';
import userModel from 'models/user';
import Login from './Login';
import Registration from './Register';
import Reset from './Reset';
import Statistics from './Statistics';
import StatisticsYear from './StatisticsYear';

const StatisticsWrap = () => <Statistics userModel={userModel} />;
const StatisticsYearWrap = () => <StatisticsYear userModel={userModel} />;

export default [
  <Route path="/user/login" key="/user/login" exact component={Login} />,
  <Route
    path="/user/register"
    key="/user/register"
    exact
    component={Registration}
  />,
  <Route path="/user/reset" key="/user/reset" exact component={Reset} />,
  <Route
    path="/user/statistics"
    key="/user/statistics"
    exact
    render={StatisticsWrap}
  />,
  <Route
    path="/user/statistics/details/:year?"
    key="/user/statistics/details"
    exact
    render={StatisticsYearWrap}
  />,
];
