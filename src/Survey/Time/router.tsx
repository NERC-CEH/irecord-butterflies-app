import React from 'react';
import { observer } from 'mobx-react';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import { RouteWithModels, AttrPage, ModelLocation } from '@apps';
import Species from 'Survey/common/Components/Species';
import CONFIG from 'common/config';
import CancelButton from 'Survey/Time/Components/CancelButton';
import Home from './Home';
import AreaAttr from './Components/Area';
import SpeciesOccurrences from './SpeciesOccurrences';
import OccurrenceHome from './OccurrenceHome';
import Details from './Details';

import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

const SpeciesWrap = (props: any) => {
  const CancelButtonWrap = () => CancelButton(props);

  return (
    <Species
      BackButton={CancelButtonWrap}
      title="Select Target Species"
      {...props}
    />
  );
};

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
  [`${baseURL}/:smpId/species`, SpeciesWrap],
  [`${baseURL}/:smpId/speciesOccurrences/:taxa`, SpeciesOccurrences],
  [`${baseURL}/:smpId/speciesOccurrences/:taxa/taxon`, SpeciesWrap],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId`, OccurrenceHome],
  [`${baseURL}/:smpId/samples/:subSmpId/occ/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/samples/:subSmpId/location`, Location],
];

export default RouteWithModels.fromArray(savedSamples, routes);
