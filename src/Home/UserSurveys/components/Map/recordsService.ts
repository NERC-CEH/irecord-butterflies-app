import axios, { AxiosRequestConfig } from 'axios';
import { LatLng } from 'leaflet';
import userModel from 'models/user';
import CONFIG from 'common/config';
import { Hit, Bucket, Record, Square } from './esResponse.d';

const getRecordsQuery = (northWest: LatLng, southEast: LatLng) =>
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
        ],
        filter: {
          geo_bounding_box: {
            'location.point': {
              top_left: {
                lat: northWest.lat,
                lon: northWest.lng,
              },
              bottom_right: {
                lat: southEast.lat,
                lon: southEast.lng,
              },
            },
          },
        },
      },
    },
  });

let requestCancelToken: any;

export async function fetchRecords(
  northWest: LatLng,
  southEast: LatLng
): Promise<Record[] | null> {
  if (requestCancelToken) {
    requestCancelToken.cancel();
  }

  requestCancelToken = axios.CancelToken.source();

  const OPTIONS: AxiosRequestConfig = {
    method: 'post',
    url: CONFIG.recordsServiceURL,
    headers: {
      authorization: `Bearer ${await userModel.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    timeout: 80000,
    cancelToken: requestCancelToken.token,
    data: getRecordsQuery(northWest, southEast),
  };

  let records = [];

  try {
    const { data } = await axios(OPTIONS);

    records = data;
  } catch (e) {
    if (axios.isCancel(e)) {
      return null;
    }
  }

  const getSource = ({ _source }: any): Hit[] => _source;
  // TODO: validate the response is correct

  return records?.hits.hits.map(getSource);
}

const getSquaresQuery = (
  northWest: LatLng,
  southEast: LatLng,
  squareSize: number
) =>
  JSON.stringify({
    size: 0,
    query: {
      bool: {
        must: [
          {
            match: {
              'metadata.survey.id': 101,
            },
          },
        ],
        filter: {
          geo_bounding_box: {
            'location.point': {
              top_left: {
                lat: northWest.lat,
                lon: northWest.lng,
              },
              bottom_right: {
                lat: southEast.lat,
                lon: southEast.lng,
              },
            },
          },
        },
      },
    },
    aggs: {
      by_srid: {
        terms: {
          field: 'location.grid_square.srid',
          size: 1000,
        },
        aggs: {
          by_square: {
            terms: {
              field: `location.grid_square.${squareSize}km.centre`,
            },
          },
        },
      },
    },
  });

export async function fetchSquares(
  northWest: LatLng,
  southEast: LatLng,
  squareSize: number // in meters
): Promise<Square[] | null> {
  if (requestCancelToken) {
    requestCancelToken.cancel();
  }

  requestCancelToken = axios.CancelToken.source();

  const squareSizeInKm = squareSize / 1000;

  const OPTIONS: AxiosRequestConfig = {
    method: 'post',
    url: CONFIG.recordsServiceURL,
    headers: {
      authorization: `Bearer ${await userModel.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    timeout: 80000,
    cancelToken: requestCancelToken.token,
    data: getSquaresQuery(northWest, southEast, squareSizeInKm),
  };

  let records = [];

  try {
    const { data } = await axios(OPTIONS);

    records = data;
  } catch (e) {
    if (axios.isCancel(e)) {
      return null;
    }
  }

  const addSize = (square: Bucket): Square => ({
    ...square,
    size: squareSize,
  });

  const squares = records?.aggregations?.by_srid?.buckets[0]?.by_square?.buckets.map(
    addSize
  );

  return squares || [];
}