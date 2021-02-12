import React from 'react';
import { RouteWithModels, AttrPage as Attr, ModelLocation } from '@apps';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import userModel from 'models/user';
import config from 'common/config';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Home from './Home';
import Species from './Species';
import survey from './config';

const baseURL = `/survey/${survey.name}`;

const HomeWrap = props => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const ModelLocationWrap = props => (
  <ModelLocation
    mapProviderOptions={config.map}
    useGridRef
    useGridMap
    onLocationNameChange={ModelLocation.utils.onLocationNameChange}
    placeholder="Site name e.g. nearest village"
    onGPSClick={ModelLocation.utils.onGPSClick}
    {...props}
  />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, Attr],
  [`${baseURL}/:smpId/occ/:occId/:attr`, Attr],
  [`${baseURL}/:smpId/location`, ModelLocationWrap],
  [`${baseURL}/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(savedSamples, routes);
