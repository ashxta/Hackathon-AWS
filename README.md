# AutoInfra - AWS AI Agent for Cost Optimization

[![AWS Hackathon](https://img.shields.io/badge/AWS-AI%20Agent%20Hackathon-orange)](https://aws.amazon.com)
[![Bedrock AgentCore](https://img.shields.io/badge/Amazon-Bedrock%20AgentCore-blue)](https://aws.amazon.com/bedrock/agentcore/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🤖 **Autonomous AWS cost optimization agent** that uses LLM reasoning to identify and execute cost-saving actions across your cloud infrastructure.

## 🎯 Hackathon Project

Built for the **AWS AI Agent Global Hackathon** - demonstrating autonomous AI agents using Amazon Bedrock AgentCore, Claude 3, and AWS services.

## ✨ Features

### 🧠 AI-Powered Analysis
- **Amazon Bedrock Integration**: Uses Claude 3 Haiku for cost-effective LLM reasoning
- **AgentCore Runtime**: Autonomous decision-making with multi-step planning
- **Risk Assessment**: Every recommendation tagged with confidence score and risk level
- **Natural Language Reasoning**: Agent explains WHY each action should be taken

### 💰 Cost Optimization
- **Real-time Monitoring**: Continuous analysis of AWS Cost Explorer and CloudWatch metrics
- **Smart Recommendations**: Identifies idle resources, oversized instances, and inefficient storage
- **Automated Actions**: Can stop EC2 instances, resize RDS, archive S3 to Glacier
- **Forecasting**: 7-day cost predictions to prevent budget overruns

### 🛡️ Safety & Control
- **Safe Mode**: Recommend-only mode (default) for human approval
- **Auto-Execute Mode**: Fully autonomous with configurable risk thresholds
- **Action Logging**: All changes tracked in S3 for audit and rollback
- **Confirmation Dialogs**: UI prevents accidental actions

### 📊 Interactive Dashboard
- Real-time cost metrics and trends
- Resource inventory with search/filter
- AI recommendation cards with impact analysis
- Action execution interface

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
AWS Bedrock AgentCore (Claude 3 Haiku)
    ├── AWS Cost Explorer → Billing data
    ├── AWS CloudWatch → Resource metrics
    ├── AWS Lambda → Action execution
    └── Amazon S3 → Report storage
```

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture diagram and component details.**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS Account with:
  - Bedrock access (Claude 3 Haiku enabled)
  - Cost Explorer enabled
  - IAM permissions for EC2, RDS, S3, Lambda, CloudWatch

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/autoinfra.git
cd autoinfra

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your AWS credentials

# Start development server
npm run dev
```

### Environment Variables

Create `.env` file:

```bash
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key
VITE_S3_BUCKET_NAME=autoinfra-reports
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete AWS deployment instructions.

## 📖 Usage

### 1. Authentication

Sign up or log in with any email and password (demo mode uses local storage).

### 2. Dashboard

View real-time cost metrics, trends, and AI-generated recommendations.

### 3. Resource Analysis

- Browse all AWS resources (EC2, RDS, S3, EBS)
- Filter by type and state
- Search by name or ID
- View CPU utilization and costs

### 4. Execute Actions

- Review AI recommendations
- Toggle Safe Mode for auto-execution
- Apply or dismiss individual actions
- Monitor savings

## 🧪 Demo Mode

If AWS credentials are not configured, AutoInfra runs in **demo mode** with:
- Simulated cost data (30 days of trends)
- Mock resource inventory (8 resources)
- Rule-based recommendations (5 optimizations)
- Simulated action execution

This allows you to explore the UI without AWS setup.

## 🤖 AWS AI Agent Compliance

AutoInfra meets all **AWS AI Agent Global Hackathon requirements**:

✅ **LLM hosted on AWS Bedrock** - Claude 3 Haiku  
✅ **Uses AgentCore primitive** - Runtime for agent execution  
✅ **Reasoning LLMs** - Structured prompts for decision-making  
✅ **Autonomous capabilities** - Runs with/without human input  
✅ **Integrates external tools** - Cost Explorer, CloudWatch, Lambda, S3  
✅ **AWS Lambda** - Action execution  
✅ **Amazon S3** - Report storage  
✅ **API Gateway** - (Optional) REST endpoints  

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed compliance mapping.