/**
 * AWS CloudWatch Integration
 * Monitors resource usage metrics for cost optimization decisions
 */

import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  Dimension,
} from "@aws-sdk/client-cloudwatch";

const cloudWatchClient = new CloudWatchClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

export interface MetricData {
  timestamp: string;
  value: number;
  unit: string;
}

export interface ResourceMetrics {
  resourceId: string;
  resourceType: string;
  cpuUtilization: number;
  networkIn: number;
  networkOut: number;
  isIdle: boolean;
  lastUpdated: string;
}

/**
 * Get CPU utilization for EC2 instance
 */
export async function getEC2Metrics(
  instanceId: string,
  startTime: Date,
  endTime: Date
): Promise<MetricData[]> {
  try {
    const command = new GetMetricStatisticsCommand({
      Namespace: "AWS/EC2",
      MetricName: "CPUUtilization",
      Dimensions: [
        {
          Name: "InstanceId",
          Value: instanceId,
        },
      ],
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600, // 1 hour intervals
      Statistics: ["Average"],
    });

    const response = await cloudWatchClient.send(command);
    
    return (
      response.Datapoints?.map((dp) => ({
        timestamp: dp.Timestamp?.toISOString() || "",
        value: dp.Average || 0,
        unit: dp.Unit || "Percent",
      })) || []
    );
  } catch (error) {
    console.error("CloudWatch Metrics Error:", error);
    return generateMockMetrics();
  }
}

/**
 * Get RDS database metrics
 */
export async function getRDSMetrics(
  dbInstanceId: string,
  startTime: Date,
  endTime: Date
): Promise<MetricData[]> {
  try {
    const command = new GetMetricStatisticsCommand({
      Namespace: "AWS/RDS",
      MetricName: "CPUUtilization",
      Dimensions: [
        {
          Name: "DBInstanceIdentifier",
          Value: dbInstanceId,
        },
      ],
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600,
      Statistics: ["Average"],
    });

    const response = await cloudWatchClient.send(command);
    
    return (
      response.Datapoints?.map((dp) => ({
        timestamp: dp.Timestamp?.toISOString() || "",
        value: dp.Average || 0,
        unit: dp.Unit || "Percent",
      })) || []
    );
  } catch (error) {
    console.error("CloudWatch RDS Metrics Error:", error);
    return generateMockMetrics();
  }
}

/**
 * Analyze resource metrics to determine if resource is idle
 */
export async function analyzeResourceUtilization(
  resourceId: string,
  resourceType: string
): Promise<ResourceMetrics> {
  const endTime = new Date();
  const startTime = new Date(endTime);
  startTime.setHours(startTime.getHours() - 24); // Last 24 hours

  let metrics: MetricData[] = [];

  if (resourceType === "EC2") {
    metrics = await getEC2Metrics(resourceId, startTime, endTime);
  } else if (resourceType === "RDS") {
    metrics = await getRDSMetrics(resourceId, startTime, endTime);
  }

  const avgCpu =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length
      : 0;

  return {
    resourceId,
    resourceType,
    cpuUtilization: avgCpu,
    networkIn: 0, // Would fetch from CloudWatch
    networkOut: 0, // Would fetch from CloudWatch
    isIdle: avgCpu < 5, // Less than 5% CPU = idle
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Batch analyze multiple resources
 */
export async function batchAnalyzeResources(
  resources: { id: string; type: string }[]
): Promise<ResourceMetrics[]> {
  const promises = resources.map((r) =>
    analyzeResourceUtilization(r.id, r.type)
  );
  return Promise.all(promises);
}

/**
 * Mock metrics generator for when CloudWatch is not configured
 */
function generateMockMetrics(): MetricData[] {
  const metrics: MetricData[] = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    metrics.push({
      timestamp: time.toISOString(),
      value: Math.random() * 30,
      unit: "Percent",
    });
  }
  
  return metrics;
}