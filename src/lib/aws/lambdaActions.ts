/**
 * AWS Lambda Functions for Action Execution
 * Safely executes cost optimization actions on AWS resources
 */

import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from "@aws-sdk/client-lambda";
import { EC2Client, StopInstancesCommand } from "@aws-sdk/client-ec2";
import { RDSClient, ModifyDBInstanceCommand } from "@aws-sdk/client-rds";
import {
  S3Client,
  PutBucketLifecycleConfigurationCommand,
} from "@aws-sdk/client-s3";

const lambdaClient = new LambdaClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const ec2Client = new EC2Client({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const rdsClient = new RDSClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

export interface ActionResult {
  success: boolean;
  message: string;
  executionId?: string;
  timestamp: string;
}

/**
 * Stop idle EC2 instance
 */
export async function stopEC2Instance(
  instanceId: string
): Promise<ActionResult> {
  try {
    const command = new StopInstancesCommand({
      InstanceIds: [instanceId],
    });

    await ec2Client.send(command);

    return {
      success: true,
      message: `Successfully stopped EC2 instance ${instanceId}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Stop EC2 Error:", error);
    return {
      success: false,
      message: `Failed to stop EC2 instance: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Resize RDS instance to smaller type
 */
export async function resizeRDSInstance(
  dbInstanceId: string,
  newInstanceClass: string
): Promise<ActionResult> {
  try {
    const command = new ModifyDBInstanceCommand({
      DBInstanceIdentifier: dbInstanceId,
      DBInstanceClass: newInstanceClass,
      ApplyImmediately: false, // Apply during maintenance window
    });

    await rdsClient.send(command);

    return {
      success: true,
      message: `Successfully scheduled RDS instance ${dbInstanceId} resize to ${newInstanceClass}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Resize RDS Error:", error);
    return {
      success: false,
      message: `Failed to resize RDS instance: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Move S3 objects to Glacier for long-term archival
 */
export async function archiveS3ToGlacier(
  bucketName: string
): Promise<ActionResult> {
  try {
    const command = new PutBucketLifecycleConfigurationCommand({
      Bucket: bucketName,
      LifecycleConfiguration: {
        Rules: [
          {
            Id: "archive-to-glacier",
            Status: "Enabled",
            Transitions: [
              {
                Days: 90,
                StorageClass: "GLACIER",
              },
            ],
          },
        ],
      },
    });

    await s3Client.send(command);

    return {
      success: true,
      message: `Successfully configured S3 bucket ${bucketName} for Glacier archival`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("S3 Glacier Archive Error:", error);
    return {
      success: false,
      message: `Failed to configure S3 archival: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Invoke Lambda function for custom action
 */
export async function invokeLambdaAction(
  functionName: string,
  payload: any
): Promise<ActionResult> {
  try {
    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify(payload),
    });

    const response = await lambdaClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.Payload));

    return {
      success: result.statusCode === 200,
      message: result.body || "Lambda executed successfully",
      executionId: response.RequestId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Lambda Invocation Error:", error);
    return {
      success: false,
      message: `Failed to invoke Lambda: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Master execution function that routes to appropriate action handler
 */
export async function executeOptimizationAction(
  actionType: string,
  resourceId: string,
  resourceType: string,
  parameters?: any
): Promise<ActionResult> {
  // Check if AWS credentials are configured
  const hasCredentials =
    import.meta.env.VITE_AWS_ACCESS_KEY_ID &&
    import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

  if (!hasCredentials) {
    return {
      success: false,
      message:
        "AWS credentials not configured. Please set VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY environment variables.",
      timestamp: new Date().toISOString(),
    };
  }

  switch (actionType) {
    case "stop":
      if (resourceType === "EC2") {
        return stopEC2Instance(resourceId);
      }
      break;

    case "resize":
      if (resourceType === "RDS") {
        return resizeRDSInstance(
          resourceId,
          parameters?.newInstanceClass || "db.t3.micro"
        );
      }
      break;

    case "archive":
      if (resourceType === "S3") {
        return archiveS3ToGlacier(resourceId);
      }
      break;

    case "lambda":
      return invokeLambdaAction(
        parameters?.functionName || "AutoInfraCostOptimizer",
        { resourceId, resourceType, ...parameters }
      );

    default:
      return {
        success: false,
        message: `Unknown action type: ${actionType}`,
        timestamp: new Date().toISOString(),
      };
  }

  return {
    success: false,
    message: `Action ${actionType} not supported for ${resourceType}`,
    timestamp: new Date().toISOString(),
  };
}