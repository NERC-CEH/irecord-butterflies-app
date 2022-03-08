import React, { FC } from 'react';
import { CircleMarker } from 'react-leaflet';
import { Record } from '../esResponse.d';

interface Props {
  record: Record;
  onClick: any;
}

const Marker: FC<Props> = ({ record, onClick }) => {
  const location = record.location.point.split(',');
  const latitude = parseFloat(location[0]);
  const longititude = parseFloat(location[1]);

  let fillColor = 'var(--ion-color-warning-tint)';
  const status = record.identification.verification_status;
  if (status === 'V') {
    fillColor = 'var(--ion-color-primary-shade)';
  } else if (status === 'R') {
    fillColor = 'var(--ion-color-danger-shade)';
  }

  const onClickWrap = () => onClick(record);

  return (
    <CircleMarker
      center={[latitude, longititude]}
      radius={10}
      className="record-marker"
      color="white"
      fillColor={fillColor}
      fillOpacity={1}
      eventHandlers={{ click: onClickWrap }}
    />
  );
};

export default Marker;
