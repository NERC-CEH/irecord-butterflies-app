import React from 'react';
import { RouteWithModels, AttrPage as Attr, ModelLocation } from '@apps';
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import userModel from 'models/user';
import config from 'common/config';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import Species from 'Survey/common/Components/Species';
import Home from './Home';
import survey from './config';

const baseURL = `/survey/${survey.name}`;

const HomeWrap = props => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const getLocation = sample => sample.attrs.location || {};

const ModelLocationWrap = props => (
  <ModelLocation
    model={props.sample} // eslint-disable-line
    mapProviderOptions={config.map}
    useGridRef
    useGridMap
    suggestLocations={savedSamples.map(getLocation)}
    onLocationNameChange={ModelLocation.utils.onLocationNameChange}
    namePlaceholder="Site name e.g. nearest village"
    onGPSClick={ModelLocation.utils.onGPSClick}
  />
);

const SpeciesWrap = props => <Species appModel={appModel} {...props} />;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, Attr],
  [`${baseURL}/:smpId/occ/:occId/:attr`, Attr],
  [`${baseURL}/:smpId/location`, ModelLocationWrap],
  [`${baseURL}/:smpId/species`, SpeciesWrap],
];

export default RouteWithModels.fromArray(savedSamples, routes);
