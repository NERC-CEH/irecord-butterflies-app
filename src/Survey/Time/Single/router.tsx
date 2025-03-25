import { Route } from 'react-router-dom';
import { AttrPage, withSample } from '@flumens';
import AreaAttr from 'Survey/Time/common/Components/Area';
import Details from 'Survey/Time/common/Components/Details';
import OccurrenceHome from 'Survey/Time/common/Components/OccurrenceHome';
import SpeciesOccurrences from 'Survey/Time/common/Components/SpeciesOccurrences';
import ModelLocation from 'Survey/common/Components/ModelLocation';
import Species from 'Survey/common/Components/Species';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

const SpeciesWrap = (props: any) => (
  <Species showCancelButton title="Select Target Species" {...props} />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/area`, AreaAttr],
  [`${baseURL}/:smpId/details`, Details],
  [`${baseURL}/:smpId/details/:attr`, withSample(AttrPageFromRoute)],
  [`${baseURL}/:smpId/species`, SpeciesWrap],
  [`${baseURL}/:smpId/speciesOccurrences/:taxa`, SpeciesOccurrences],
  [`${baseURL}/:smpId/speciesOccurrences/:taxa/taxon`, Species],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId`, OccurrenceHome],
  [
    `${baseURL}/:smpId/samples/:subSmpId/occ/:occId/:attr`,
    withSample(AttrPageFromRoute),
  ],
  [`${baseURL}/:smpId/samples/:subSmpId/location`, ModelLocation],
].map(([route, component]: any) => (
  <Route key={route} path={route} component={component} exact />
));

export default routes;
