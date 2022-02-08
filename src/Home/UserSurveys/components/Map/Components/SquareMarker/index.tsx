import React, { FC } from 'react';
import L from 'leaflet';
import { Circle } from 'react-leaflet';
import clsx from 'clsx';
import { Square } from '../../esResponse.d';

import './styles.scss';

interface Props {
  square: Square;
  totalSquares: number;
}

// const Marker: FC<Props> = ({ square }) => {
const Marker: FC<Props> = ({ square, totalSquares }) => {
  console.log(square.doc_count, totalSquares);

  const opacity = square.doc_count / totalSquares;

  const location = square.key.split(' ');
  const latitude = parseFloat(location[1]);
  const longititude = parseFloat(location[0]);

  const radius = (square.size / 2) * 0.8; // 20% for padding

  return (
    <Circle
      center={[latitude, longititude]}
      radius={radius}
      // className={clsx('square-marker', opacity)}
      fillOpacity={opacity}
    />
  );
};

export default Marker;
