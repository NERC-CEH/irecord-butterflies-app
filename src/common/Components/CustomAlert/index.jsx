import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonBackdrop } from '@ionic/react';
import './styles.scss';

function CustomAlert({ children }) {
  return (
    <div className="custom-alert">
      <IonBackdrop tappable visible stopPropagation />
      <div className="message">{children}</div>
    </div>
  );
}

CustomAlert.propTypes = exact({
  children: PropTypes.any.isRequired,
});

export default CustomAlert;
