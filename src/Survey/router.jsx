import ListRoutes from './List/router';
import PointRoutes from './Point/router';
import MultiSpeciesRoutes from './Time/Multi/router';
import TimeRoutes from './Time/Single/router';

export default [
  ...PointRoutes,
  ...ListRoutes,
  ...TimeRoutes,
  ...MultiSpeciesRoutes,
];
