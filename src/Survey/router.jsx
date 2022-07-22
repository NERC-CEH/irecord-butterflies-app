import PointRoutes from './Point/router';
import ListRoutes from './List/router';
import TimeRoutes from './Time/Single/router';
import MultiSpeciesRoutes from './Time/Multi/router';

export default [
  ...PointRoutes,
  ...ListRoutes,
  ...TimeRoutes,
  ...MultiSpeciesRoutes,
];
