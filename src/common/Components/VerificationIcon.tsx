import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import Occurrence from 'models/occurrence';

interface Props {
  occ: Occurrence;
}

const VerificationIcon = ({ occ }: Props) => {
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
