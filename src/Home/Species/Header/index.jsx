import React from 'react';
// import PropTypes from 'prop-types';
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonHeader,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { toast } from '@apps';
import { searchOutline, funnelOutline } from 'ionicons/icons';
import './styles.scss';

const inWIP = () => toast.warn('Sorry, this is still WIP.');
const onSearch = inWIP;
const onFilter = inWIP;

const Header = () => {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={onSearch}>
            <IonIcon slot="icon-only" icon={searchOutline} />
          </IonButton>
        </IonButtons>

        <IonTitle size="large">
          iRecord <b>Butterflies</b>
        </IonTitle>

        <IonButtons slot="end">
          <IonButton onClick={onFilter}>
            <IonIcon slot="icon-only" icon={funnelOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

Header.propTypes = {};

export default Header;
