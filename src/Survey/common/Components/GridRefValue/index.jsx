import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonSpinner } from '@ionic/react';
import { observer } from 'mobx-react';
import { prettyPrintLocation } from '@apps';
import './styles.scss';

function getValue(sample) {
  if (sample.isGPSRunning()) {
    return <IonSpinner />;
  }

  return prettyPrintLocation(sample.attrs.location);
}

function GridRefValue({ sample, requiredMessage = '' }) {
  const value = getValue(sample);

  return <div className="gridref-label">{value || requiredMessage}</div>;
}

GridRefValue.propTypes = exact({
  sample: PropTypes.object.isRequired,
  requiredMessage: PropTypes.elementType,
});

export default observer(GridRefValue);
