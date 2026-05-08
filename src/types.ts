export interface S3Bucket {
  name: string;
  created: string;
}

export interface CloudTrailEvent {
  event: string;
  user: string;
  time: string;
}

export interface MonitoringData {
  timestamp: string;
  s3_buckets: S3Bucket[];
  cloudtrail_events: CloudTrailEvent[];
  cloudwatch_metrics: {
    metric_count: number;
  };
}

export interface APIResponse {
  monitoring_data: MonitoringData;
  ai_analysis: string;
}

export interface S3BucketCreate {
  bucket_name: string;
  region: string;
  access_key: string;
  secret_key: string;
}
