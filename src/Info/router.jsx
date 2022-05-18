import { Route } from 'react-router-dom';
import Credits from './Credits';
import FAQ from './FAQ';

export default [
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
  <Route path="/info/faq" key="/info/faq" exact component={FAQ} />,
];
