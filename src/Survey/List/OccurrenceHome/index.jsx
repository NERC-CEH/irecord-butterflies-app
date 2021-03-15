import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Page, Header } from '@apps';
import { observer } from 'mobx-react';
import Main from './Main';
import './styles.scss';

function OccurrenceHome({ occurrence }) {
  if (!occurrence) {
    return null;
  }

  return (
    <Page id="survey-list-occurrence-edit">
      <Header title="Species" defaultHref="/home/surveys" />
      <Main occurrence={occurrence} />
    </Page>
  );
}

OccurrenceHome.propTypes = exact({
  occurrence: PropTypes.object.isRequired,
});

export default observer(OccurrenceHome);
