import axios from 'axios';
import { APIResponse, S3BucketCreate } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    'VITE_API_URL is missing from .env'
  );
}
// --------------------------------------------------
// GET Monitoring Data
// --------------------------------------------------

export const fetchMonitoringData =
  async (): Promise<APIResponse> => {

    try {

      const response =
        await axios.get(API_URL);

      console.log(
        'RAW API RESPONSE:',
        response.data
      );

      // --------------------------------
      // Handle API Gateway Proxy Format
      // --------------------------------

      if (response.data.body) {

        return typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data.body;
      }

      return response.data;

    } catch (error) {

      console.error(
        'API Error:',
        error
      );

      throw error;
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

      const response =
        await axios.post(
          API_URL,
          payload,
          {
            headers: {
              'Content-Type':
                'application/json',
            },
          }
        );

      console.log(
        'CREATE BUCKET RESPONSE:',
        response.data
      );

      // --------------------------------
      // Handle API Gateway Proxy Format
      // --------------------------------

      if (response.data.body) {

        return typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data.body;
      }

      return response.data;

    } catch (error) {

      console.error(
        'Create Bucket Error:',
        error
      );

      throw error;
    }
};