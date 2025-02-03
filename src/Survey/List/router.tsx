import { RouteWithModels, AttrPage } from '@flumens';
import savedSamples from 'models/collections/samples';
import Occurrence from 'models/occurrence';
import ModelLocation from 'Survey/common/Components/ModelLocation';
import Species from 'Survey/common/Components/Species';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import OccurrenceHome from './OccurrenceHome';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

type OccurrenceHomeWrapProps = { occurrence: Occurrence };
const OccurrenceHomeWrap = ({ occurrence }: OccurrenceHomeWrapProps) => (
  <OccurrenceHome occurrence={occurrence} />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/occ/:occId`, OccurrenceHomeWrap],
  [`${baseURL}/:smpId/occ/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/occ/:occId/species`, Species],
  [`${baseURL}/:smpId/location`, ModelLocation],
  [`${baseURL}/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(savedSamples, routes);
