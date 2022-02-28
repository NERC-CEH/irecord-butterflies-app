import React, { FC } from 'react';
import Occurrence from 'models/occurrence';
import { IonIcon } from '@ionic/react';
import { checkmarkOutline, helpOutline, closeOutline } from 'ionicons/icons';

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
    detailIcon = checkmarkOutline;
  }

  if (status === 'plausible') {
    idClass = 'id-amber';
    detailIcon = helpOutline;
  }

  if (status === 'rejected') {
    idClass = 'id-red';
    detailIcon = closeOutline;
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
