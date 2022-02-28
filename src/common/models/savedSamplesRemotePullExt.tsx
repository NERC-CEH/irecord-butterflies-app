/* eslint-disable camelcase */
import React from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import AppModelProps from 'models/app';
import Occurrence from 'models/occurrence';
import SavedSamplesProps from 'models/savedSamples';
import UserModelProps from 'models/user';
import Sample from 'models/sample';
import { alert, device } from '@apps';
import UpdatedRecordsDialog from 'common/Components/UpdatedRecordsDialog';
import CONFIG from 'common/config';

// export type
interface Occurrence {
  source_system_key: string;
}

interface Verifier {
  id?: string;
  name?: string;
}

interface AutoChecks {
  result: string;
  enabled: string;
  output: any[];
}

export interface Identification {
  verifier?: Verifier;
  auto_checks: AutoChecks;
  verification_decision_source: string;
  verification_substatus: string;
  verified_on: string;
  verification_status: string;
}

interface Source {
  identification: Identification;
  occurrence: Occurrence;
}
interface Hit {
  _source: Source;
}

const DEFAULT_15_MINUTES = 15 * 60 * 1000;

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
              },
            },
          },
        ],
      },
    },
  });

async function fetchUpdatedRemoteSamples(
  userModel: typeof UserModelProps,
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

  // normalizeData
  const normalizedResponse: { [key: string]: Hit } = {};

  const normalizeResponse = ({ ...hit }: Hit) => {
    normalizedResponse[hit._source.occurrence.source_system_key] = { ...hit };
  };

  data.hits.hits.forEach(normalizeResponse);

  return normalizedResponse;
}

function appendVerificationAndReturnOccurrences(
  savedSamples: typeof SavedSamplesProps,
  updatedRemoteSamples: any
) {
  const updatedSamples: any = [];

  if (updatedRemoteSamples.length <= 0) return updatedSamples;

  const findMatchingLocalSamples = (sample: typeof Sample) => {
    if (sample.isSurveySingleSpeciesTimedCount()) return;

    const appendVerification = (occ: typeof Occurrence) => {
      const updatedSample = updatedRemoteSamples[occ.cid];

      if (!updatedSample) return;

      const hasBeenVerified = occ.metadata?.verification;
      if (hasBeenVerified) return;

      // eslint-disable-next-line no-param-reassign
      occ.metadata.verification = {
        ...updatedSample._source.identification,
      };

      updatedSamples.push(updatedSample);
    };

    sample.occurrences.forEach(appendVerification);
    sample.save();
  };

  savedSamples.forEach(findMatchingLocalSamples);

  return updatedSamples;
}

function init(
  savedSamples: typeof SavedSamplesProps,
  userModel: typeof UserModelProps,
  appModel: typeof AppModelProps
) {
  if (!appModel.attrs.verifiedRecordsTimestamp) {
    // set one month back timestamp
    const currentTime = new Date();
    const getTimeOneMonthBack = currentTime.setMonth(
      currentTime.getMonth() - 1
    );

    // eslint-disable-next-line no-param-reassign
    appModel.attrs.verifiedRecordsTimestamp = new Date(getTimeOneMonthBack);
    appModel.save();
  }

  async function sync() {
    if (!userModel.hasLogIn() || !device.isOnline()) return;

    const {
      verifiedRecordsTimestamp,
      showVerifiedRecordsNotification,
    } = appModel.attrs;

    const currentTime = new Date();

    const isUnder15mins =
      currentTime.getTime() - verifiedRecordsTimestamp < DEFAULT_15_MINUTES;

    if (isUnder15mins) return;

    const formattedTimestamp = new Date(verifiedRecordsTimestamp)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    // timestamp format '2020-02-21 08:37:55.218'
    const updatedRemoteSamples = await fetchUpdatedRemoteSamples(
      userModel,
      formattedTimestamp
    );

    // eslint-disable-next-line no-param-reassign
    appModel.attrs.verifiedRecordsTimestamp = new Date().getTime();
    appModel.save();

    const updatedLocalSamples = await appendVerificationAndReturnOccurrences(
      savedSamples,
      updatedRemoteSamples
    );

    if (!updatedLocalSamples.length) return;

    showVerifiedRecordsNotification &&
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

  savedSamples._init.then(sync);
  const period = DEFAULT_15_MINUTES;
  setInterval(sync, period);
}

export default init;
