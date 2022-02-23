import React, { FC } from 'react';
import Occurrence from 'models/occurrence';
import { IonLabel } from '@ionic/react';
import { checkmarkOutline, helpOutline, closeOutline } from 'ionicons/icons';

interface Props {
  occ: typeof Occurrence;
}

const VerificationListIcon: FC<Props> = ({ occ }) => {
  if (!occ.isUploaded()) return null;

  const status = occ.getVerificationStatus();
  if (!status) return null;

  let rejected = 0;
  let verified = 0;
  let plausible = 0;

  let detailIcon;
  let idClass;

  if (status === 'verified') {
    idClass = 'id-green';
    verified += 1;
    detailIcon = checkmarkOutline;
  }

  if (status === 'plausible') {
    plausible += 1;
    idClass = 'id-amber';
    detailIcon = helpOutline;
  }

  if (status === 'rejected') {
    rejected += 1;
    idClass = 'id-red';
    detailIcon = closeOutline;
  }

  return (
    <>
      {!!rejected && (
        <IonLabel slot="end" className="verificationIcon id-green">
          {rejected}
        </IonLabel>
      )}

      {!!plausible && (
        <IonLabel slot="end" className="verificationIcon id-amber">
          {plausible}
        </IonLabel>
      )}

      {!!verified && (
        <IonLabel slot="end" className="verificationIcon id-red">
          {verified}
        </IonLabel>
      )}
    </>
  );
};

export default VerificationListIcon;
