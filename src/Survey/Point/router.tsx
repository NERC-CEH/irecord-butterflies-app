import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import Group from 'Survey/common/Components/GroupAttrPage';
import ModelLocation from 'Survey/common/Components/ModelLocation';
import Species from 'Survey/common/Components/Species';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/occ/:occId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/location`, ModelLocation],
  [`${baseURL}/:smpId/group`, Group],
  [`${baseURL}/:smpId/species`, Species],
].map(([route, component]: any) => (
  <Route key={route} path={route} component={component} exact />
));

export default routes;
