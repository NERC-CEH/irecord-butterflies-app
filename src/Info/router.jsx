import React from 'react';
import { Route } from 'react-router-dom';
import Credits from './Credits';
import WhereToLook from './WhereToLook';

export default [
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
  <Route
    path="/info/where-to-look"
    key="/info/where-to-look"
    exact
    component={WhereToLook}
  />,
];
