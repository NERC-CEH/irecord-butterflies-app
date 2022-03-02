import React, { FC } from 'react';
import Occurrence from 'models/occurrence';
import { InfoMessage, InfoButton } from '@apps';
import clsx from 'clsx';
import { checkmarkCircle, helpCircle, closeCircle } from 'ionicons/icons';
import './styles.scss';

const getVerificationText = (
  status: string,
  message: string,
  taxonName: string
) => {
  const statusMessage = message || status;
  const verifyStatus: { [key: string]: JSX.Element } = {
    verified: (
      <>
        <h2>
          <b>Verification</b>: {statusMessage}
        </h2>

        <p>Thanks for sending in your record.</p>
      </>
    ),
    plausible: (
      <>
        <h2>
          <b>Verification</b>: {statusMessage}
        </h2>
        <p>
          Thanks for sending in your record. From this record details, we think
          it could be the <b>{taxonName}</b> species.
        </p>
      </>
    ),
    rejected: (
      <>
        <h2>
          <b>Verification</b>: {statusMessage}
        </h2>

        <p>
          Thanks for sending in your record. We do not think this is{' '}
          <b>{taxonName}</b> species.
        </p>
      </>
    ),
  };

  return verifyStatus[status];
};

interface Props {
  occurrence: typeof Occurrence;
}

const icons: { [key: string]: string } = {
  verified: checkmarkCircle,
  plausible: helpCircle,
  rejected: closeCircle,
};

const VerificationMessage: FC<Props> = ({ occurrence }) => {
  const status = occurrence.getVerificationStatus();
  const message = occurrence.getVerificationStatusMessage();
  const taxonName = occurrence.attrs.taxon.commonName;
  const verificationObject = occurrence?.metadata?.verification;

  if (!status) return null;

  const textCode = status;

  const verificationText = getVerificationText(textCode, message, taxonName);

  if (!verificationText) return null;

  const icon: string = icons[status];

  const verifierName = verificationObject?.verifier?.name;
  const verifyDate = verificationObject?.verified_on?.split(' ')[0];

  const hasVerifyDetails = verifierName && verifyDate;

  return (
    <InfoMessage className={clsx('verification-message', status)} icon={icon}>
      {verificationText}
      {hasVerifyDetails && (
        <InfoButton label="Details" header="Details">
          <p>
            Verified by: <b>{verifierName}</b>
          </p>
          <p>
            Verified on: <b>{verifyDate}</b>
          </p>
        </InfoButton>
      )}
    </InfoMessage>
  );
};

export default VerificationMessage;
