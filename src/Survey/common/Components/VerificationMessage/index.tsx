// TOOD: REVIEW THE CODE
import React, { FC } from 'react';
import Occurrence from 'models/occurrence';
import { InfoMessage, InfoButton } from '@apps';
import clsx from 'clsx';
import { checkmarkCircle, helpCircle, closeCircle } from 'ionicons/icons';
import './styles.scss';

const InfoButtonWithProps = ({
  verifier,
  verifyDate,
}: {
  verifier: string;
  verifyDate: string;
}) => (
  <InfoButton label="READ MORE" header="Info">
    <p>
      Verified by: <b>{verifier}</b>
    </p>
    <p>
      Verified on: <b>{verifyDate}</b>
    </p>
  </InfoButton>
);

const verificationTexts = (
  status: string,
  verificationObject: any,
  message: string
) => {
  const { taxon } = verificationObject;
  const verifierName = verificationObject.verifier.name;
  const verifyDate = verificationObject.verified_on.split(' ')[0];

  const statusMessage = message || status;
  const object: { [key: string]: JSX.Element } = {
    verified: (
      <>
        <p>
          Thanks for sending in your record using the <b>iRecord Butterfly</b>{' '}
          app. Your record been <b>{statusMessage}</b>.
        </p>

        <InfoButtonWithProps verifier={verifierName} verifyDate={verifyDate} />
      </>
    ),
    plausible: (
      <>
        <p>
          Thanks for sending in your record using the <b>iRecord Butterfly</b>{' '}
          app. From your phothos, we think it could be <b>{statusMessage}</b>{' '}
          the <b>{taxon}</b> species
        </p>

        <InfoButtonWithProps verifier={verifierName} verifyDate={verifyDate} />
      </>
    ),
    rejected: (
      <>
        <p>
          Thanks for sending in your record using the <b>iRecord Butterfly</b>{' '}
          app. From your phothos, your record been <b>{statusMessage}</b>. We do
          not think this is <b>{taxon}</b> species
        </p>

        <InfoButtonWithProps verifier={verifierName} verifyDate={verifyDate} />
      </>
    ),
  };

  return object[status];
};

interface Props {
  occurrence: typeof Occurrence;
}

const VerificationMessage: FC<Props> = ({ occurrence }) => {
  const status = occurrence.getVerificationStatus();
  const message = occurrence.getVerificationStatusMessage();

  if (!status) return null;

  const icons: { [key: string]: string } = {
    verified: checkmarkCircle,
    plausible: helpCircle,
    rejected: closeCircle,
  };

  const textCode = status;

  const verificationText = verificationTexts(
    textCode,
    occurrence.metadata.verification,
    message
  );

  if (!verificationText) return null;

  const icon: string = icons[status];

  return (
    <InfoMessage className={clsx('verification-message', status)} icon={icon}>
      {verificationText}
    </InfoMessage>
  );
};

export default VerificationMessage;
