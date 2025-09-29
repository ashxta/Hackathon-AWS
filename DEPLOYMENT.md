# AutoInfra - Deployment Guide

## AWS AI Agent Global Hackathon Submission

This guide provides step-by-step instructions for deploying AutoInfra to AWS for the hackathon submission.

## 🎯 Hackathon Requirements Checklist

- ✅ **LLM hosted on AWS Bedrock** (Claude 3 Haiku)
- ✅ **Amazon Bedrock AgentCore** (Runtime primitive)
- ✅ **Reasoning LLMs** for decision-making
- ✅ **Autonomous capabilities** (safe mode + auto-execute)
- ✅ **Integrates APIs & external tools** (Cost Explorer, CloudWatch, Lambda, S3)
- ✅ **AWS Lambda** for action execution
- ✅ **Amazon S3** for report storage
- ✅ **API Gateway** (optional endpoint exposure)

## Prerequisites

### 1. AWS Account Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key  
# Region: us-east-1 (recommended)
# Output format: json
```

### 2. Enable Required AWS Services

1. **Amazon Bedrock**:
   - Go to AWS Console → Bedrock
   - Request access to Claude 3 Haiku model
   - Wait for approval (usually instant)

2. **Cost Explorer**:
   - Go to AWS Console → Billing
   - Enable Cost Explorer (if not already enabled)

3. **CloudWatch**:
   - Automatically enabled, no action needed

4. **S3 Bucket**:
```bash
# Create S3 bucket for reports
aws s3 mb s3://autoinfra-reports-$(date +%s) --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket autoinfra-reports-$(date +%s) \
  --versioning-configuration Status=Enabled
```

### 3. IAM Role Setup

Create an IAM role with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:StopInstances",
        "rds:DescribeDBInstances",
        "rds:ModifyDBInstance",
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:AutoInfra*"
    }
  ]
}
```

Save as `autoinfra-policy.json` and create:

```bash
# Create IAM policy
aws iam create-policy \
  --policy-name AutoInfraPolicy \
  --policy-document file://autoinfra-policy.json

# Create IAM role for Lambda
aws iam create-role \
  --role-name AutoInfraLambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach policy to role
aws iam attach-role-policy \
  --role-name AutoInfraLambdaRole \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT:policy/AutoInfraPolicy
```

## Deployment Steps

### Step 1: Configure Environment Variables

Create `.env` file in project root:

```bash
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your-access-key-id
VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key

# S3 Bucket (created above)
VITE_S3_BUCKET_NAME=autoinfra-reports-your-timestamp

# Bedrock Model
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# Optional: API Gateway URL (if deploying backend)
VITE_API_GATEWAY_URL=https://your-api.execute-api.us-east-1.amazonaws.com
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build Frontend

```bash
npm run build
```

This creates optimized production build in `dist/` folder.

### Step 4: Deploy Frontend to S3

```bash
# Create S3 bucket for static hosting
aws s3 mb s3://autoinfra-frontend --region us-east-1

# Enable static website hosting
aws s3 website s3://autoinfra-frontend \
  --index-document index.html \
  --error-document index.html

# Make bucket public
aws s3api put-bucket-policy \
  --bucket autoinfra-frontend \
  --policy file://bucket-policy.json

# Upload build files
aws s3 sync dist/ s3://autoinfra-frontend/ --delete

# Get website URL
echo "http://autoinfra-frontend.s3-website-us-east-1.amazonaws.com"
```

**bucket-policy.json**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::autoinfra-frontend/*"
    }
  ]
}
```

### Step 5: Deploy Lambda Functions (Optional Backend)

Create Lambda function for serverless backend:

**lambda/index.js**:
```javascript
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { CostExplorerClient, GetCostAndUsageCommand } = require("@aws-sdk/client-cost-explorer");

exports.handler = async (event) => {
  // Your Lambda logic here
  // Integrate with Bedrock, Cost Explorer, CloudWatch
  
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "AutoInfra Agent executed successfully",
      analysis: {}
    })
  };
};
```

Deploy Lambda:

```bash
# Package dependencies
cd lambda/
npm install
zip -r function.zip .

# Create Lambda function
aws lambda create-function \
  --function-name AutoInfraAgent \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/AutoInfraLambdaRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512
```

### Step 6: Deploy API Gateway (Optional)

```bash
# Create REST API
aws apigateway create-rest-api \
  --name AutoInfraAPI \
  --endpoint-configuration types=REGIONAL

# Create resource and methods
# (Follow AWS API Gateway setup guide)

# Deploy API
aws apigateway create-deployment \
  --rest-api-id YOUR_API_ID \
  --stage-name prod
```

### Step 7: Setup CloudWatch Event for Scheduled Analysis

Run agent automatically every day:

```bash
# Create EventBridge rule
aws events put-rule \
  --name AutoInfraDailyAnalysis \
  --schedule-expression "rate(1 day)"

# Add Lambda as target
aws events put-targets \
  --rule AutoInfraDailyAnalysis \
  --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:ACCOUNT:function:AutoInfraAgent"

# Give EventBridge permission to invoke Lambda
aws lambda add-permission \
  --function-name AutoInfraAgent \
  --statement-id AllowEventBridgeInvoke \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:us-east-1:ACCOUNT:rule/AutoInfraDailyAnalysis
```

## Testing Deployment

### 1. Test Frontend

```bash
# Open in browser
open http://autoinfra-frontend.s3-website-us-east-1.amazonaws.com

# Test authentication
# Test dashboard loading
# Test resource analysis
# Test action recommendations
```

### 2. Test Bedrock Integration

```bash
# Test Lambda function directly
aws lambda invoke \
  --function-name AutoInfraAgent \
  --payload '{"action":"analyze"}' \
  response.json

cat response.json
```

### 3. Test Cost Explorer

```bash
# Verify Cost Explorer access
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity DAILY \
  --metrics UnblendedCost
```

## CloudFront Distribution (Optional CDN)

For better performance and HTTPS:

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name autoinfra-frontend.s3.us-east-1.amazonaws.com \
  --default-root-object index.html

# Get CloudFront domain
# d1234abcd.cloudfront.net
```

## Monitoring & Logs

### CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/AutoInfraAgent --follow

# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=AutoInfraAgent \
  --start-time 2025-01-01T00:00:00Z \
  --end-time 2025-01-31T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

## Cost Estimates

Using AWS Free Tier and $100 hackathon credits:

- **S3 Storage**: ~$0.50/month (reports)
- **S3 Hosting**: ~$0.50/month (website)
- **Lambda**: ~$1.00/month (daily runs)
- **Bedrock Claude Haiku**: ~$0.25/1K tokens (~$2/month)
- **Cost Explorer**: Free (included in AWS account)
- **CloudWatch**: ~$1/month (metrics)
- **API Gateway**: ~$0.50/month (if used)

**Total**: ~$5-10/month (well within $100 credits)

## Troubleshooting

### Issue: Bedrock Access Denied

```bash
# Check model access
aws bedrock list-foundation-models

# Request model access in AWS Console
# Bedrock → Model Access → Request Access
```

### Issue: CORS Errors

Add CORS headers to Lambda responses:

```javascript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Issue: Cost Explorer Not Working

```bash
# Enable Cost Explorer
aws ce describe-cost-category-definition --cost-category-arn ""

# May take 24 hours to populate data
```

## Hackathon Submission

### Required Components

1. ✅ **Public Code Repo**: GitHub repository with all source code
2. ✅ **Architecture Diagram**: See ARCHITECTURE.md
3. ✅ **Text Description**: See README.md and FEATURES.md
4. ✅ **Demo Video**: Record 3-minute walkthrough
5. ✅ **Deployed URL**: S3 website or CloudFront URL

### Demo Video Script (3 minutes)

1. **Introduction** (30s): Explain AutoInfra and problem it solves
2. **Architecture** (45s): Show AWS services integration diagram
3. **Live Demo** (90s):
   - Login to dashboard
   - View cost trends and AI recommendations
   - Analyze resources
   - Execute cost-saving action
4. **Results** (15s): Show savings achieved and Bedrock agent reasoning

## Production Checklist

- [ ] Enable MFA on AWS account
- [ ] Use AWS Secrets Manager for credentials
- [ ] Enable CloudTrail for audit logs
- [ ] Set up billing alerts
- [ ] Configure backup for S3 reports
- [ ] Implement rate limiting on API Gateway
- [ ] Add custom domain with Route 53
- [ ] Enable WAF for security
- [ ] Configure auto-scaling for Lambda
- [ ] Set up monitoring dashboard

## Support

For issues or questions:
- GitHub Issues: [your-repo]/issues
- AWS Support: AWS Console → Support Center

## License

MIT License - See LICENSE file for details