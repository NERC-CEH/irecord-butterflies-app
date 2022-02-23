// TOOD: REVIEW THE CODE
/* eslint-disable camelcase */
import React, { FC } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import AppModelProps from 'models/app';
import Occurrence from 'models/occurrence';
import SavedSamplesProps from 'models/savedSamples';
import UserModelProps from 'models/user';
import Sample from 'models/sample';
import { alert, device } from '@apps';
import { IonItem, IonCheckbox, IonLabel } from '@ionic/react';
import CONFIG from 'common/config';

interface Props {
  appModel: typeof AppModelProps;
}
const UpdatedRecordsDialog: FC<Props> = ({ appModel }) => {
  // eslint-disable-next-line no-param-reassign
  const toggleMessage = () => {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showUpdatedRecordsNotification = !appModel.attrs
      .showUpdatedRecordsNotification;
  };

  return (
    <>
      Some of your records have been verified. Please check your records list.
      <IonItem lines="none" className="updated-records-dialog">
        <IonLabel>Do not show again</IonLabel>
        <IonCheckbox slot="start" checked={false} onIonChange={toggleMessage} />
      </IonItem>
    </>
  );
};

interface Occurrence {
  source_system_key: string;
}

interface Verifier {
  id: string;
  name: string;
}

interface AutoChecks {
  result: string;
  enabled: string;
  output: any[];
}

interface Identification {
  verifier: Verifier;
  auto_checks: AutoChecks;
  verification_decision_source: string;
  verification_substatus: string;
  verified_on: string;
  verification_status: string;
}

interface Source {
  occurrence: Occurrence;
  identification: Identification;
  taxon: {
    vernacular_name: string;
  };
  id: string;
}

interface Hit {
  _source: Source;
}

const DEFAULT_15_MINUTES = 30 * 1000;

const getRecordsQuery = (timestamp: string) =>
  JSON.stringify({
    size: 1000,
    query: {
      bool: {
        must: [
          {
            match: {
              'metadata.survey.id': 101,
            },
          },
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    'identification.verification_status': 'C',
                  },
                },
                {
                  match_phrase: {
                    'identification.verification_status': 'V',
                  },
                },
                {
                  match_phrase: {
                    'identification.verification_status': 'R',
                  },
                },
              ],
            },
          },
          {
            range: {
              'metadata.updated_on': {
                gte: timestamp,
                // gte: '2020-02-21 08:37:55.218',
              },
            },
          },
        ],
      },
    },
  });

async function fetchUpdatedRemoteSamples(
  userModel: typeof UserModelProps,
  appModel: typeof AppModelProps,
  timestamp: string
) {
  console.log('SavedSamples: pulling remote surveys');

  const OPTIONS: AxiosRequestConfig = {
    method: 'post',
    url: CONFIG.recordsServiceURL,
    headers: {
      authorization: `Bearer ${await userModel.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    timeout: 80000,
    data: getRecordsQuery(timestamp),
  };

  const { data } = await axios(OPTIONS);

  // eslint-disable-next-line no-param-reassign
  appModel.attrs.updatedRecordsTimestamp = new Date().getTime();
  appModel.save();

  return data.hits.hits || [];
}

function fetchUpdatedLocalSamples(
  savedSamples: typeof SavedSamplesProps,
  updatedRemoteSamples: any
) {
  const updatedSamples: any = [];

  if (updatedRemoteSamples.length <= 0) return updatedSamples;

  const normalizedResponse: { [key: string]: Hit } = {};
  const normalizeResponse = ({ ...hit }: Hit) => {
    normalizedResponse[hit._source.id] = { ...hit };
  };

  updatedRemoteSamples.forEach(normalizeResponse);

  const findMatchingLocalSamples = (sample: typeof Sample) => {
    // eslint-disable-next-line no-param-reassign

    if (sample.occurrences.length) {
      const formattedData = (occ: typeof Occurrence) => {
        const updatedSample = normalizedResponse[occ.cid];

        if (!updatedSample) return;

        const hasBeenVerified = occ.metadata?.verification;
        if (hasBeenVerified) return;

        const newVerificationObject = updatedSample._source;

        // eslint-disable-next-line no-param-reassign
        occ.metadata.verification = {
          ...newVerificationObject.identification,
          occurrence: newVerificationObject.occurrence.source_system_key,
          taxon: newVerificationObject.taxon.vernacular_name,
        };
      };

      sample.occurrences.forEach(formattedData);
      sample.save();
    }
  };

  savedSamples.forEach(findMatchingLocalSamples);

  return updatedSamples;
}

function init(
  savedSamples: typeof SavedSamplesProps,
  userModel: typeof UserModelProps,
  appModel: typeof AppModelProps
) {
  const startTime =
    appModel.attrs.updatedRecordsTimestamp || new Date().getTime();

  async function sync() {
    if (!userModel.attrs.indiciaUserId) return;

    if (!device.isOnline()) return;

    const {
      updatedRecordsTimestamp,
      showUpdatedRecordsNotification,
    } = appModel.attrs;

    const currentTime = new Date();
    const has15MinutePeriodPassed =
      currentTime.getTime() - startTime < DEFAULT_15_MINUTES;

    if (has15MinutePeriodPassed) return;

    const isFirstTime = !updatedRecordsTimestamp;
    if (isFirstTime) {
      // set one month back timestamp
      const getTimeOneMonthBack = currentTime.setMonth(
        currentTime.getMonth() - 1
      );

      // eslint-disable-next-line no-param-reassign
      appModel.attrs.updatedRecordsTimestamp = new Date(getTimeOneMonthBack);
      appModel.save();
    } else {
      // eslint-disable-next-line no-param-reassign
      appModel.attrs.updatedRecordsTimestamp = new Date();
      appModel.save();
    }

    const formattedTimestamp = new Date(appModel.attrs.updatedRecordsTimestamp)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    // timestamp format'2020-02-21 08:37:55.218'
    const updatedRemoteSamples = await fetchUpdatedRemoteSamples(
      userModel,
      appModel,
      formattedTimestamp
    );

    const updatedLocalSamples = await fetchUpdatedLocalSamples(
      savedSamples,
      updatedRemoteSamples
    );

    if (updatedLocalSamples.length) {
      // Need to be fixed: show only once
      // global extension, create variable isAlertShowing set true
      // onDismiss set false

      // !iscurrentnotificatinshowing &&

      showUpdatedRecordsNotification &&
        alert({
          message: <UpdatedRecordsDialog appModel={appModel} />,
          buttons: [
            {
              text: 'Ok',
              cssClass: 'primary',
              handler: () => appModel.save(),
            },
          ],
        });
    }
  }

  savedSamples._init.then(sync);
  const period = DEFAULT_15_MINUTES;
  // setInterval(sync, period);
}

export default init;
