import MetricsCard from "./MetricsCard";
import RecommendationCard from "./RecommendationCard";
import CostTrendChart from "./CostTrendChart";
import { DollarSign, TrendingDown, Zap, Server } from "lucide-react";

const Dashboard = () => {
  return (
    <section className="relative px-6 py-20 max-w-7xl mx-auto">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Real-Time Cost Intelligence</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered insights analyzing your AWS infrastructure 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Monthly Cost"
            value="$8,642"
            change="-32% from last month"
            icon={DollarSign}
            trend="down"
            delay={0}
          />
          <MetricsCard
            title="Potential Savings"
            value="$2,847"
            change="Available this month"
            icon={TrendingDown}
            trend="down"
            delay={0.1}
          />
          <MetricsCard
            title="Active Resources"
            value="1,247"
            change="12 idle detected"
            icon={Server}
            trend="down"
            delay={0.2}
          />
          <MetricsCard
            title="Optimization Score"
            value="87%"
            change="+5% improvement"
            icon={Zap}
            trend="up"
            delay={0.3}
          />
        </div>

        <CostTrendChart />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">AI Recommendations</h3>
            <span className="text-sm text-muted-foreground">Updated 2 minutes ago</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecommendationCard
              title="Stop idle EC2 instances"
              description="12 EC2 instances running with <5% CPU utilization for the past 7 days"
              savings="$847/mo"
              impact="high"
              service="EC2"
              delay={0}
            />
            <RecommendationCard
              title="Resize over-provisioned RDS"
              description="Database instance using only 30% of allocated capacity consistently"
              savings="$456/mo"
              impact="high"
              service="RDS"
              delay={0.1}
            />
            <RecommendationCard
              title="Move S3 to Glacier"
              description="348GB of data not accessed in 90 days can be archived"
              savings="$234/mo"
              impact="medium"
              service="S3"
              delay={0.2}
            />
            <RecommendationCard
              title="Delete unused EBS volumes"
              description="23 unattached volumes detected across regions"
              savings="$189/mo"
              impact="medium"
              service="EBS"
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
