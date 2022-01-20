import savedSamples from 'models/savedSamples';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import { RouteWithModels } from '@apps';
import Home from './Home';
import AreaAttr from './Components/Area';
import survey from './config';

const baseURL = `/survey/${survey.name}`;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/area`, AreaAttr],
];

export default RouteWithModels.fromArray(savedSamples, routes);
