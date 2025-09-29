// Simulated AWS data for demonstration
// In production, this would fetch from AWS Cost Explorer, CloudWatch, etc.

export interface Resource {
  id: string;
  name: string;
  type: 'EC2' | 'RDS' | 'S3' | 'EBS' | 'Lambda' | 'ECS';
  region: string;
  state: 'running' | 'stopped' | 'idle' | 'active';
  cost: number;
  cpuUtilization: number;
  lastAccessed: string;
  tags: { [key: string]: string };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  savings: number;
  impact: 'high' | 'medium' | 'low';
  service: string;
  action: string;
  status: 'pending' | 'applied' | 'rejected';
  resourceId: string;
}

export interface CostData {
  date: string;
  cost: number;
  forecast?: number;
}

// Generate mock resources
export const generateMockResources = (): Resource[] => {
  const resources: Resource[] = [
    {
      id: 'i-0a1b2c3d4e5f6',
      name: 'web-server-prod-01',
      type: 'EC2',
      region: 'us-east-1',
      state: 'running',
      cost: 156.40,
      cpuUtilization: 3.2,
      lastAccessed: '2025-09-29T10:30:00Z',
      tags: { Environment: 'Production', Team: 'Backend' }
    },
    {
      id: 'i-1b2c3d4e5f6a',
      name: 'analytics-worker-02',
      type: 'EC2',
      region: 'us-west-2',
      state: 'idle',
      cost: 234.80,
      cpuUtilization: 1.5,
      lastAccessed: '2025-09-22T08:15:00Z',
      tags: { Environment: 'Production', Team: 'Analytics' }
    },
    {
      id: 'db-prod-mysql-01',
      name: 'main-database',
      type: 'RDS',
      region: 'us-east-1',
      state: 'running',
      cost: 456.20,
      cpuUtilization: 28.5,
      lastAccessed: '2025-09-29T11:00:00Z',
      tags: { Environment: 'Production', Team: 'Backend' }
    },
    {
      id: 'db-staging-pg-01',
      name: 'staging-database',
      type: 'RDS',
      region: 'us-east-1',
      state: 'idle',
      cost: 312.50,
      cpuUtilization: 8.2,
      lastAccessed: '2025-09-28T16:20:00Z',
      tags: { Environment: 'Staging', Team: 'Backend' }
    },
    {
      id: 's3-backups-prod',
      name: 'prod-backups',
      type: 'S3',
      region: 'us-east-1',
      state: 'active',
      cost: 89.30,
      cpuUtilization: 0,
      lastAccessed: '2025-06-15T00:00:00Z',
      tags: { Environment: 'Production', Team: 'Operations' }
    },
    {
      id: 's3-logs-archive',
      name: 'logs-archive',
      type: 'S3',
      region: 'us-west-2',
      state: 'active',
      cost: 145.60,
      cpuUtilization: 0,
      lastAccessed: '2025-05-01T00:00:00Z',
      tags: { Environment: 'Production', Team: 'Operations' }
    },
    {
      id: 'vol-0123456789abcdef',
      name: 'unattached-volume-01',
      type: 'EBS',
      region: 'us-east-1',
      state: 'idle',
      cost: 45.20,
      cpuUtilization: 0,
      lastAccessed: '2025-08-10T00:00:00Z',
      tags: { Environment: 'Development' }
    },
    {
      id: 'vol-abcdef0123456789',
      name: 'old-snapshot-volume',
      type: 'EBS',
      region: 'us-west-2',
      state: 'idle',
      cost: 67.80,
      cpuUtilization: 0,
      lastAccessed: '2025-07-20T00:00:00Z',
      tags: { Environment: 'Development' }
    }
  ];

  return resources;
};

// Generate mock recommendations
export const generateMockRecommendations = (): Recommendation[] => {
  return [
    {
      id: 'rec-001',
      title: 'Stop idle EC2 instances',
      description: '2 EC2 instances running with <5% CPU utilization for the past 7 days',
      savings: 391.20,
      impact: 'high',
      service: 'EC2',
      action: 'stop',
      status: 'pending',
      resourceId: 'i-1b2c3d4e5f6a'
    },
    {
      id: 'rec-002',
      title: 'Resize over-provisioned RDS',
      description: 'Staging database using only 8% CPU - downsize from db.m5.xlarge to db.t3.large',
      savings: 187.50,
      impact: 'high',
      service: 'RDS',
      action: 'resize',
      status: 'pending',
      resourceId: 'db-staging-pg-01'
    },
    {
      id: 'rec-003',
      title: 'Move S3 to Glacier Deep Archive',
      description: '348GB of backup data not accessed in 90+ days can be archived',
      savings: 234.90,
      impact: 'medium',
      service: 'S3',
      action: 'archive',
      status: 'pending',
      resourceId: 's3-backups-prod'
    },
    {
      id: 'rec-004',
      title: 'Delete unused EBS volumes',
      description: '2 unattached EBS volumes detected - total 500GB',
      savings: 113.00,
      impact: 'medium',
      service: 'EBS',
      action: 'delete',
      status: 'pending',
      resourceId: 'vol-0123456789abcdef'
    },
    {
      id: 'rec-005',
      title: 'Enable S3 Intelligent Tiering',
      description: 'Automatically optimize storage costs based on access patterns',
      savings: 67.40,
      impact: 'low',
      service: 'S3',
      action: 'configure',
      status: 'pending',
      resourceId: 's3-logs-archive'
    }
  ];
};

// Generate mock cost trend data
export const generateMockCostData = (): CostData[] => {
  const data: CostData[] = [];
  const baseDate = new Date('2025-09-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic cost fluctuations
    const baseCost = 8600;
    const variance = Math.sin(i / 5) * 500 + Math.random() * 300;
    const cost = baseCost + variance;
    
    data.push({
      date: date.toISOString().split('T')[0],
      cost: Math.round(cost * 100) / 100
    });
  }
  
  // Add forecast for next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 30 + i);
    
    const forecastCost = 5800 + Math.random() * 400;
    
    data.push({
      date: date.toISOString().split('T')[0],
      forecast: Math.round(forecastCost * 100) / 100
    });
  }
  
  return data;
};

// Calculate metrics
export const calculateMetrics = (resources: Resource[], recommendations: Recommendation[]) => {
  const totalCost = resources.reduce((sum, r) => sum + r.cost, 0);
  const potentialSavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  const idleResources = resources.filter(r => r.state === 'idle' || r.cpuUtilization < 5).length;
  const optimizationScore = Math.round((1 - (idleResources / resources.length)) * 100);
  
  return {
    totalCost: Math.round(totalCost * 100) / 100,
    potentialSavings: Math.round(potentialSavings * 100) / 100,
    activeResources: resources.length,
    idleResources,
    optimizationScore
  };
};