import { observer } from 'mobx-react';
import savedSamples from 'models/savedSamples';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import { RouteWithModels, AttrPage, ModelLocation } from '@flumens';
import CONFIG from 'common/config';
import AreaAttr from 'Survey/Time/common/Components/Area';
import OccurrenceHome from 'Survey/Time/common/Components/OccurrenceHome';
import SpeciesOccurrences from 'Survey/Time/common/Components/SpeciesOccurrences';
import Details from 'Survey/Time/common/Components/Details';
import Species from './Species';
import Home from './Home';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

const ModelLocationWrap = (props: any) => (
  <ModelLocation model={props.subSample} mapProviderOptions={CONFIG.map} />
);
const Location = observer(ModelLocationWrap);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/area`, AreaAttr],
  [`${baseURL}/:smpId/details`, Details],
  [`${baseURL}/:smpId/details/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/species`, Species],
  [`${baseURL}/:smpId/speciesOccurrences/:taxa/taxon`, Species],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/samples/:subSmpId/location`, Location],

  [`${baseURL}/:smpId/speciesOccurrences/:taxa`, SpeciesOccurrences],
  [`${baseURL}/:smpId/speciesOccurrences/:taxa/taxon`, Species],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId`, OccurrenceHome],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId/taxon`, Species],
  [`${baseURL}/:smpId/samples/:subSmpId/location`, Location],
];

export default RouteWithModels.fromArray(savedSamples, routes);
