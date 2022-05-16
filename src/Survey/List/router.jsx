import React from 'react';
import { RouteWithModels, AttrPage } from '@apps';
import savedSamples from 'models/savedSamples';
import StartNewSurvey from 'Survey/common/Components/StartNewSurvey';
import ModelLocationWithInfo from 'Survey/common/Components/ModelLocationWithInfo';
import Species from 'Survey/common/Components/Species';
import Home from './Home';
import OccurrenceHome from './OccurrenceHome';
import survey from './config';

const { AttrPageFromRoute } = AttrPage;

const baseURL = `/survey/${survey.name}`;

// eslint-disable-next-line
const OccurrenceHomeWrap = ({ occurrence }) => (
  <OccurrenceHome occurrence={occurrence} />
);

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, Home],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/occ/:occId`, OccurrenceHomeWrap],
  [`${baseURL}/:smpId/occ/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/occ/:occId/species`, Species],
  [`${baseURL}/:smpId/location`, ModelLocationWithInfo],
  [`${baseURL}/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(savedSamples, routes);
