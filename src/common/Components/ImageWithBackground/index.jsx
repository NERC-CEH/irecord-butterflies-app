import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import './styles.scss';

function ImageWithBackground({ src }) {
  return (
    <div className="image-with-background">
      <div style={{ background: `url("${src}")` }} className="image-fill" />
      <div
        style={{ background: `url("${src}")` }}
        className="image-fill-close"
      />
      <div style={{ background: `url("${src}")` }} className="image" />
    </div>
  );
}

ImageWithBackground.propTypes = exact({
  src: PropTypes.string.isRequired,
});

export default ImageWithBackground;
