import axios from 'axios';
import { APIResponse, S3BucketCreate } from '../types';

// --------------------------------------------------
// API URL
// --------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    'VITE_API_URL is missing from .env'
  );
}

console.log('API URL:', API_URL);

// --------------------------------------------------
// Axios Instance
// --------------------------------------------------

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --------------------------------------------------
// Normalize API Gateway Response
// --------------------------------------------------

const normalizeResponse = (data: any) => {

  console.log('RAW RESPONSE:', data);

  // Lambda Proxy Integration
  if (data?.body) {

    if (typeof data.body === 'string') {
      try {
        return JSON.parse(data.body);
      } catch {
        return data.body;
      }
    }

    return data.body;
  }

  return data;
};

// --------------------------------------------------
// GET Monitoring Data
// --------------------------------------------------

export const fetchMonitoringData =
  async (): Promise<APIResponse> => {

    try {

      const response =
        await apiClient.get('/');

      const normalized =
        normalizeResponse(response.data);

      console.log(
        'MONITORING DATA:',
        normalized
      );

      return normalized;

    } catch (error: any) {

      console.error(
        'GET Monitoring Error:',
        error
      );

      console.error(
        'GET Error Response:',
        error?.response?.data
      );

      throw new Error(
        error?.response?.data?.message ||
        'Failed to fetch monitoring data'
      );
    }
};

// --------------------------------------------------
// POST Create Bucket
// --------------------------------------------------

export const createBucket =
  async (
    payload: S3BucketCreate
  ): Promise<any> => {

    try {

      console.log(
        'CREATE BUCKET PAYLOAD:',
        payload
      );

      const response =
        await apiClient.post(
          '/',
          payload
        );

      const normalized =
        normalizeResponse(response.data);

      console.log(
        'CREATE BUCKET SUCCESS:',
        normalized
      );

      return normalized;

    } catch (error: any) {

      console.error(
        'CREATE BUCKET ERROR:',
        error
      );

      console.error(
        'CREATE BUCKET RESPONSE:',
        error?.response?.data
      );

      // Better frontend error handling
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Bucket creation failed';

      throw new Error(message);
    }
};
