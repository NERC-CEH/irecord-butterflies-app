import React from 'react';
import { InfoBackgroundMessage } from '@apps';
import appModel from 'models/app';

export default props => (
  <InfoBackgroundMessage appModel={appModel} {...props} />
);
