# AutoInfra - AWS AI Agent Architecture

## System Overview

AutoInfra is an autonomous AI agent built on AWS services that continuously monitors cloud infrastructure, uses LLM reasoning to identify cost optimization opportunities, and can automatically or semi-automatically execute cost-saving actions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Frontend (React + Vite)                         │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Dashboard   │  │   Resources   │  │    Actions   │  │  Auth/Login │ │
│  └──────────────┘  └───────────────┘  └──────────────┘  └─────────────┘ │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        AWS Integration Layer                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │               Amazon Bedrock AgentCore Runtime                    │   │
│  │  ┌─────────────────────────────────────────────────────────┐     │   │
│  │  │  Autonomous AI Agent (Claude 3 Haiku / Llama 3)        │     │   │
│  │  │  • Analyze cost & usage data                            │     │   │
│  │  │  • LLM-powered reasoning for recommendations            │     │   │
│  │  │  • Risk assessment & confidence scoring                 │     │   │
│  │  │  • Multi-step decision making                           │     │   │
│  │  └─────────────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  AWS Cost        │  │  AWS CloudWatch  │  │  AWS Lambda      │
│  Explorer        │  │                  │  │  Functions       │
│                  │  │                  │  │                  │
│  • Billing data  │  │  • CPU metrics   │  │  • Stop EC2      │
│  • Usage trends  │  │  • Network I/O   │  │  • Resize RDS    │
│  • Cost forecast │  │  • Resource util │  │  • Archive S3    │
└──────────────────┘  └──────────────────┘  └──────────────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                                 ▼
                      ┌──────────────────┐
                      │   Amazon S3      │
                      │                  │
                      │  • Store reports │
                      │  • Analysis logs │
                      │  • Action history│
                      └──────────────────┘
                                 │
                                 ▼
                      ┌──────────────────┐
                      │  API Gateway     │
                      │                  │
                      │  • REST endpoints│
                      │  • Auth & access │
                      └──────────────────┘
```

## Component Details

### 1. Frontend Application (React + Vite)

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Shadcn/UI component library
- Tailwind CSS for styling
- Recharts for data visualization

**Key Features:**
- **Authentication System**: Secure login/signup with session management
- **Dashboard**: Real-time cost monitoring, trend analysis, and AI recommendations
- **Resource Analyzer**: Comprehensive inventory with search and filtering
- **Action Executor**: Safe mode toggle and action management interface

### 2. AWS Bedrock AgentCore (Core AI Agent)

**Purpose**: Autonomous decision-making engine using LLM reasoning

**Implementation:**
- **Model**: Claude 3 Haiku (cost-effective) or Amazon Nova
- **Function**: `analyzeWithBedrockAgent()` in `src/lib/aws/bedrockAgent.ts`

**Agent Capabilities:**
- Analyzes cost, usage, and performance data
- Generates actionable recommendations with reasoning
- Assesses risk levels and confidence scores
- Prioritizes high-impact, low-risk actions
- Supports both autonomous and recommend-only modes

**AgentCore Primitives Used:**
1. **Runtime**: Secure execution environment for agent logic
2. **Memory**: Maintains context across analysis sessions
3. **Tool Integration**: Connects to Cost Explorer, CloudWatch, Lambda
4. **Reasoning**: LLM-powered decision-making process

### 3. AWS Cost Explorer Integration

**Purpose**: Fetch billing and usage data for analysis

**Implementation:**
- File: `src/lib/aws/costExplorer.ts`
- Functions: `getCostAndUsage()`, `getCostForecast()`, `analyzeCostTrends()`

**Data Collected:**
- Daily/monthly cost breakdowns
- Service-level spending
- Usage quantity metrics
- 7-day cost forecasts
- Trend analysis (up/down/stable)

### 4. AWS CloudWatch Integration

**Purpose**: Monitor resource utilization metrics

**Implementation:**
- File: `src/lib/aws/cloudWatch.ts`
- Functions: `getEC2Metrics()`, `getRDSMetrics()`, `analyzeResourceUtilization()`

**Metrics Monitored:**
- CPU utilization (EC2, RDS)
- Network I/O
- Disk usage
- Idle resource detection (<5% CPU)

### 5. AWS Lambda Functions

**Purpose**: Execute cost optimization actions safely

**Implementation:**
- File: `src/lib/aws/lambdaActions.ts`
- Functions: `stopEC2Instance()`, `resizeRDSInstance()`, `archiveS3ToGlacier()`

**Available Actions:**
- **Stop**: Shut down idle EC2 instances
- **Resize**: Downsize over-provisioned RDS databases
- **Archive**: Move cold S3 data to Glacier
- **Delete**: Remove unused EBS volumes
- **Optimize**: Enable S3 Intelligent Tiering

### 6. Amazon S3 Storage

**Purpose**: Store optimization reports and analysis results

**Implementation:**
- File: `src/lib/aws/s3Storage.ts`
- Functions: `saveReportToS3()`, `getReportFromS3()`, `listReportsFromS3()`

**Stored Data:**
- Optimization reports (JSON format)
- Agent analysis history
- Action execution logs
- Savings calculations

### 7. API Gateway (Optional)

**Purpose**: Expose REST endpoints for external integrations

**Endpoints** (to be implemented):
- `GET /api/analysis` - Get latest analysis
- `POST /api/execute` - Execute optimization action
- `GET /api/reports` - List all reports
- `GET /api/resources` - Get resource inventory

## Data Flow

1. **Monitoring Phase**:
   - CloudWatch collects resource metrics (CPU, network, etc.)
   - Cost Explorer fetches billing data
   - Data is aggregated for agent analysis

2. **Analysis Phase**:
   - Bedrock Agent receives context (costs + metrics)
   - LLM reasoning identifies inefficiencies
   - Agent generates recommendations with risk assessment
   - Analysis results stored in S3

3. **Action Phase**:
   - User reviews recommendations in UI
   - Actions approved (manual) or auto-executed (autonomous mode)
   - Lambda functions execute actions
   - Results logged and stored

4. **Reporting Phase**:
   - Reports generated with savings calculations
   - Stored in S3 for historical analysis
   - Available via API Gateway

## AI Agent Qualification

### ✅ Meets AWS Hackathon Requirements

1. **LLM hosted on AWS Bedrock** ✓
   - Uses Claude 3 Haiku model
   - Invoked via `BedrockRuntimeClient`

2. **Uses AWS Services** ✓
   - Amazon Bedrock AgentCore (Runtime primitive)
   - Amazon Bedrock (Nova/Claude models)
   - AWS Cost Explorer API
   - AWS CloudWatch API
   - AWS Lambda
   - Amazon S3
   - API Gateway (optional)

3. **Uses Reasoning LLMs** ✓
   - Claude 3 Haiku for cost-effective reasoning
   - Structured prompts for decision-making
   - JSON-formatted responses with reasoning

4. **Demonstrates Autonomy** ✓
   - Can operate with or without human input
   - Safe mode for recommendations
   - Auto-execute mode for approved actions
   - Continuous monitoring capability

5. **Integrates External Tools** ✓
   - AWS APIs (Cost Explorer, CloudWatch)
   - Lambda functions for execution
   - S3 for data storage
   - Multi-service orchestration

## Security & Safety

- **Safe Mode Default**: Recommendations only, no automatic execution
- **Credential Management**: Environment variables for AWS access
- **Action Confirmation**: UI confirmation dialogs before execution
- **Risk Assessment**: Every action tagged with risk level
- **Rollback Capability**: Actions logged for potential rollback
- **IAM Permissions**: Least-privilege access model

## Scalability

- **Serverless Architecture**: Lambda scales automatically
- **AgentCore Runtime**: Handles concurrent agent sessions
- **S3 Storage**: Unlimited report storage
- **CloudWatch**: Real-time metrics at scale
- **Multi-Account Support**: Can analyze entire AWS organization

## Cost Optimization

- **Model Selection**: Claude Haiku for cost-effective reasoning
- **Caching**: CloudWatch metrics cached to reduce API calls
- **Batch Processing**: Analyze multiple resources in parallel
- **Scheduled Analysis**: Run agent on cron schedule (e.g., daily)
- **Report Archival**: Old reports moved to S3 Glacier

## Deployment

### Prerequisites

```bash
# AWS credentials
export VITE_AWS_REGION="us-east-1"
export VITE_AWS_ACCESS_KEY_ID="your-access-key"
export VITE_AWS_SECRET_ACCESS_KEY="your-secret-key"
export VITE_S3_BUCKET_NAME="autoinfra-reports"
```

### Installation

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Deploy to AWS (static hosting)
aws s3 sync dist/ s3://autoinfra-frontend/
```

### Lambda Deployment

```bash
# Package Lambda functions
cd lambda/
zip -r autoinfra-optimizer.zip .

# Deploy
aws lambda create-function \
  --function-name AutoInfraCostOptimizer \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://autoinfra-optimizer.zip \
  --role arn:aws:iam::ACCOUNT:role/AutoInfraLambdaRole
```

## Future Enhancements

- Multi-cloud support (Azure, GCP)
- Team notifications (Slack, Teams, Email)
- Natural language querying with Amazon Q
- Advanced ML forecasting
- Custom optimization policies
- Automated incident response
- Self-healing infrastructure capabilities

## License

MIT License - See LICENSE file for details