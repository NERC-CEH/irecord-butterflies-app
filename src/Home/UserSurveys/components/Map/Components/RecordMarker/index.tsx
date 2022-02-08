import React, { FC } from 'react';
import L from 'leaflet';
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

  return (
    <CircleMarker
      center={[latitude, longititude]}
      radius={10}
      className="record-marker"
      color="#ff5b00"
      fillColor="#ff5b00"
      fillOpacity={0.8}
      eventHandlers={{ click: showRecordInfo }}
    />
  );
};

export default Marker;
