export interface S3Bucket {

  bucket_name: string;

  region: string;

  created: string;

  encrypted: boolean;

  public_access: boolean;

  versioning: boolean;

  lifecycle_policy: boolean;

  logging_enabled: boolean;

  risk_level:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';
}

// =========================================
// CLOUDTRAIL
// =========================================

export interface CloudTrailEvent {

  event: string;

  user: string;

  time: string;
}

// =========================================
// BEDROCK MODEL
// =========================================

export interface BedrockModel {

  model_id: string;

  provider: string;

  input_modalities: string[];

  output_modalities: string[];

  streaming_supported: boolean;

  inference_types: string[];
}

// =========================================
// BEDROCK MONITORING
// =========================================

export interface BedrockMonitoring {

  total_models: number;

  models: BedrockModel[];
}

// =========================================
// BEDROCK USAGE
// =========================================

export interface BedrockUsage {

  last_24h_invocations: number;
}

// =========================================
// BILLING
// =========================================

export interface BillingData {

  monthly_cost: number;

  currency: string;
}

// =========================================
// MONITORING DATA
// =========================================

export interface MonitoringData {

  timestamp: string;

  s3_monitoring: S3Bucket[];

  cloudtrail_events:
    CloudTrailEvent[];

  cloudwatch_metrics: {

    metric_count: number;
  };

  s3_billing: BillingData;

  bedrock_monitoring:
    BedrockMonitoring;

  bedrock_usage:
    BedrockUsage;
}

// =========================================
// API RESPONSE
// =========================================

export interface APIResponse {

  monitoring_data:
    MonitoringData;

  ai_analysis: string;
}

// =========================================
// CREATE BUCKET
// =========================================

export interface S3BucketCreate {

  bucket_name: string;

  region: string;
}

// =========================================
// BEDROCK PROFILE
// =========================================

export interface BedrockProfilePayload {

  profile_name: string;

  model_arn: string;
}