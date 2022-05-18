import { FC } from 'react';
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

  let fillColor = 'var(--ion-verification-plausible)';
  const status = record.identification.verification_status;
  if (status === 'V') {
    fillColor = 'var(--ion-verification-success)';
  } else if (status === 'R') {
    fillColor = 'var(--ion-verification-rejected)';
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
