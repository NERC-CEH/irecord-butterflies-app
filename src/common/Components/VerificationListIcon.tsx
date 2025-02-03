import { IonLabel } from '@ionic/react';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

interface Props {
  sample: Sample;
}

const VerificationListIcon = ({ sample }: Props) => {
  let rejected = 0;
  let verified = 0;
  let plausible = 0;

  const aggregateStatus = (occ: Occurrence) => {
    if (!occ.isUploaded()) return null;

    const status = occ.getVerificationStatus();
    if (!status) return null;

    if (status === 'verified') {
      verified += 1;
    }

    if (status === 'plausible') {
      plausible += 1;
    }

    if (status === 'rejected') {
      rejected += 1;
    }

    return null;
  };

  const hasSubSample = sample.samples.length;
  if (hasSubSample) {
    const getSamples = (subSample: Sample) => {
      subSample.occurrences.forEach(aggregateStatus);
    };
    sample.samples.forEach(getSamples);
  } else {
    sample.occurrences.forEach(aggregateStatus);
  }

  if (!rejected && !plausible && !verified) return null;

  return (
    <IonLabel slot="end" className="verification-list-icons">
      {!!rejected && (
        <IonLabel slot="end" className="verificationIcon id-red">
          {rejected}
        </IonLabel>
      )}

      {!!plausible && (
        <IonLabel slot="end" className="verificationIcon id-amber">
          {plausible}
        </IonLabel>
      )}

      {!!verified && (
        <IonLabel slot="end" className="verificationIcon id-green">
          {verified}
        </IonLabel>
      )}
    </IonLabel>
  );
};

export default VerificationListIcon;
