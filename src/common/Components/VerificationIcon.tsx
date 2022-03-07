import React, { FC } from 'react';
import Occurrence from 'models/occurrence';
import { IonIcon } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

interface Props {
  occ: typeof Occurrence;
}

const VerificationIcon: FC<Props> = ({ occ }) => {
  if (!occ.isUploaded()) return null;

  const status = occ.getVerificationStatus();
  if (!status) return null;

  let detailIcon;
  let idClass;

  if (status === 'verified') {
    idClass = 'id-green';
    detailIcon = checkmarkCircle;
  }

  if (status === 'plausible') {
    idClass = 'id-amber';
    detailIcon = checkmarkCircle;
  }

  if (status === 'rejected') {
    idClass = 'id-red';
    detailIcon = closeCircle;
  }

  return (
    <IonIcon
      slot="end"
      className={`verificationIcon ${idClass}`}
      icon={detailIcon}
    />
  );
};

export default VerificationIcon;
