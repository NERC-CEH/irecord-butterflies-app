import { Route } from 'react-router-dom';
import userModel from 'models/user';
import Login from './Login';
import Register from './Register';
import Reset from './Reset';
import Statistics from './Statistics';
import StatisticsYear from './StatisticsYear';

const LoginWrap = () => <Login userModel={userModel} />;
const RegistrationWrap = () => <Register userModel={userModel} />;
const ResetWrap = () => <Reset userModel={userModel} />;
const StatisticsWrap = () => <Statistics userModel={userModel} />;
const StatisticsYearWrap = () => <StatisticsYear userModel={userModel} />;

export default [
  <Route path="/user/login" key="/user/login" exact render={LoginWrap} />,
  <Route
    path="/user/register"
    key="/user/register"
    exact
    render={RegistrationWrap}
  />,
  <Route path="/user/reset" key="/user/reset" exact render={ResetWrap} />,
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
