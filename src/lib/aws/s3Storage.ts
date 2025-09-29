/**
 * AWS S3 Storage Integration
 * Stores optimization reports and analysis results
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME || "autoinfra-reports";

export interface Report {
  reportId: string;
  timestamp: string;
  analysis: any;
  actions: any[];
  savings: number;
}

/**
 * Save optimization report to S3
 */
export async function saveReportToS3(report: Report): Promise<string> {
  try {
    const key = `reports/${report.timestamp}/${report.reportId}.json`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(report, null, 2),
      ContentType: "application/json",
      Metadata: {
        reportId: report.reportId,
        timestamp: report.timestamp,
        savings: report.savings.toString(),
      },
    });

    await s3Client.send(command);

    return `s3://${BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error(`Failed to save report to S3: ${error}`);
  }
}

/**
 * Retrieve report from S3
 */
export async function getReportFromS3(reportId: string): Promise<Report> {
  try {
    // List objects to find the report
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `reports/`,
    });

    const listResponse = await s3Client.send(listCommand);
    const reportKey = listResponse.Contents?.find((obj) =>
      obj.Key?.includes(reportId)
    )?.Key;

    if (!reportKey) {
      throw new Error(`Report ${reportId} not found`);
    }

    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: reportKey,
    });

    const response = await s3Client.send(getCommand);
    const body = await response.Body?.transformToString();

    return JSON.parse(body || "{}");
  } catch (error) {
    console.error("S3 Retrieval Error:", error);
    throw new Error(`Failed to retrieve report from S3: ${error}`);
  }
}

/**
 * List all reports from S3
 */
export async function listReportsFromS3(): Promise<Report[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "reports/",
    });

    const response = await s3Client.send(command);
    const reports: Report[] = [];

    for (const obj of response.Contents || []) {
      if (obj.Key) {
        try {
          const reportId = obj.Key.split("/").pop()?.replace(".json", "");
          if (reportId) {
            const report = await getReportFromS3(reportId);
            reports.push(report);
          }
        } catch (error) {
          console.error(`Failed to load report ${obj.Key}:`, error);
        }
      }
    }

    return reports.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("S3 List Error:", error);
    return [];
  }
}