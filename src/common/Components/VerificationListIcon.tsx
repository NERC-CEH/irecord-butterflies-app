import React, { FC } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { IonLabel } from '@ionic/react';

interface Props {
  sample: typeof Sample;
}

const VerificationListIcon: FC<Props> = ({ sample }) => {
  let rejected = 0;
  let verified = 0;
  let plausible = 0;

  const aggregateStatus = (occ: typeof Occurrence) => {
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
  sample.occurrences.forEach(aggregateStatus);

  if (!rejected && !plausible && !verified) return null;

  return (
    <>
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
    </>
  );
};

export default VerificationListIcon;
