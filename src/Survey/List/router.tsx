import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import ModelLocation from 'Survey/common/Components/ModelLocation';
import Species from 'Survey/common/Components/Species';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import OccurrenceHome from './OccurrenceHome';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/occ/:occId`, OccurrenceHome],
  [`${baseURL}/:smpId/occ/:occId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/occ/:occId/species`, Species],
  [`${baseURL}/:smpId/location`, ModelLocation],
  [`${baseURL}/:smpId/species`, Species],
].map(([route, component]: any) => (
  <Route key={route} path={route} component={component} exact />
));

export default routes;
