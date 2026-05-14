import axios from 'axios';

import {
  APIResponse,
  S3BucketCreate,
} from '../types';

// ==========================================
// TYPES
// ==========================================

export interface BedrockProfilePayload {

  profile_name: string;

  model_arn: string;
}

// ==========================================
// API URL
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL;

if (!API_URL) {

  throw new Error(
    'VITE_API_URL is missing from .env'
  );
}

console.log(
  'API URL:',
  API_URL
);

// ==========================================
// AXIOS INSTANCE
// ==========================================

const apiClient = axios.create({

  baseURL: API_URL,

  timeout: 30000,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// NORMALIZE API GATEWAY RESPONSE
// ==========================================

const normalizeResponse = (
  data: any
) => {

  console.log(
    'RAW RESPONSE:',
    data
  );

  if (data?.body) {

    if (
      typeof data.body === 'string'
    ) {

      try {

        return JSON.parse(
          data.body
        );

      } catch {

        return data.body;
      }
    }

    return data.body;
  }

  return data;
};

// ==========================================
// GENERIC ERROR HANDLER
// ==========================================

const handleApiError = (
  error: any,
  fallbackMessage: string
) => {

  console.error(
    'API ERROR:',
    error
  );

  console.error(
    'API ERROR RESPONSE:',
    error?.response?.data
  );

  const message =

    error?.response?.data?.message ||

    error?.response?.data?.error ||

    error?.message ||

    fallbackMessage;

  throw new Error(message);
};

// ==========================================
// GET MONITORING DATA
// ==========================================

export const fetchMonitoringData =
  async (): Promise<APIResponse> => {

    try {

      const response =
        await apiClient.get('/');

      const normalized =
        normalizeResponse(
          response.data
        );

      console.log(
        'MONITORING DATA:',
        normalized
      );

      return normalized;

    } catch (error: any) {

      handleApiError(
        error,
        'Failed to fetch monitoring data'
      );

      throw error;
    }
};

// ==========================================
// CREATE ENTERPRISE S3 BUCKET
// ==========================================

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

          '/bucket',

          payload
        );

      const normalized =
        normalizeResponse(
          response.data
        );

      console.log(
        'CREATE BUCKET SUCCESS:',
        normalized
      );

      return normalized;

    } catch (error: any) {

      handleApiError(
        error,
        'Bucket creation failed'
      );

      throw error;
    }
};

// ==========================================
// CREATE BEDROCK PROFILE
// ==========================================

export const createBedrockProfile =
  async (
    payload: BedrockProfilePayload
  ): Promise<any> => {

    try {

      console.log(
        'CREATE BEDROCK PROFILE:',
        payload
      );

      const response =
        await apiClient.post(

          '/bedrock/profile',

          payload
        );

      const normalized =
        normalizeResponse(
          response.data
        );

      console.log(
        'BEDROCK PROFILE CREATED:',
        normalized
      );

      return normalized;

    } catch (error: any) {

      handleApiError(
        error,
        'Failed to create Bedrock profile'
      );

      throw error;
    }
};

// ==========================================
// GET BEDROCK MODELS
// ==========================================

export const fetchBedrockModels =
  async (): Promise<any> => {

    try {

      const response =
        await apiClient.get(
          '/bedrock/models'
        );

      const normalized =
        normalizeResponse(
          response.data
        );

      console.log(
        'BEDROCK MODELS:',
        normalized
      );

      return normalized;

    } catch (error: any) {

      handleApiError(
        error,
        'Failed to fetch Bedrock models'
      );

      throw error;
    }
};