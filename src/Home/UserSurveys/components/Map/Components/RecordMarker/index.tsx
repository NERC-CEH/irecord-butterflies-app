import React, { FC } from 'react';
import { CircleMarker } from 'react-leaflet';
import { alert } from '@apps';
import SpeciesProfile from './Components/SpeciesProfile';
import { Record } from '../../esResponse.d';
import './styles.scss';

interface Props {
  record: Record;
}

const Marker: FC<Props> = ({ record }) => {
  const location = record.location.point.split(',');
  const latitude = parseFloat(location[0]);
  const longititude = parseFloat(location[1]);

  const showRecordInfo = (..._: any) => {
    alert({
      cssClass: 'alert-species-profile-container',
      message: <SpeciesProfile record={record} />,
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
        },
      ],
    });
  };

  let fillColor = 'var(--ion-color-medium)';
  const status = record.identification.verification_status;
  if (status === 'V') {
    fillColor = 'var(--ion-color-primary)';
  } else if (status === 'R') {
    fillColor = 'var(--ion-color-danger)';
  }

  return (
    <CircleMarker
      center={[latitude, longititude]}
      radius={10}
      className="record-marker"
      color="white"
      fillColor={fillColor}
      fillOpacity={1}
      eventHandlers={{ click: showRecordInfo }}
    />
  );
};

export default Marker;
