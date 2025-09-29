import { useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import MetricsCard from '@/components/MetricsCard';
import RecommendationCard from '@/components/RecommendationCard';
import CostTrendChart from '@/components/CostTrendChart';
import { DollarSign, TrendingDown, Zap, Server } from 'lucide-react';
import { generateMockResources, generateMockRecommendations, calculateMetrics } from '@/lib/awsData';

export const DashboardPage = () => {
  const resources = useMemo(() => generateMockResources(), []);
  const recommendations = useMemo(() => generateMockRecommendations(), []);
  const metrics = useMemo(() => calculateMetrics(resources, recommendations), [resources, recommendations]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Real-time cost intelligence powered by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Monthly Cost"
              value={`$${metrics.totalCost.toLocaleString()}`}
              change="-32% from last month"
              icon={DollarSign}
              trend="down"
              delay={0}
            />
            <MetricsCard
              title="Potential Savings"
              value={`$${metrics.potentialSavings.toLocaleString()}`}
              change="Available this month"
              icon={TrendingDown}
              trend="down"
              delay={0.1}
            />
            <MetricsCard
              title="Active Resources"
              value={metrics.activeResources.toString()}
              change={`${metrics.idleResources} idle detected`}
              icon={Server}
              trend="down"
              delay={0.2}
            />
            <MetricsCard
              title="Optimization Score"
              value={`${metrics.optimizationScore}%`}
              change="+5% improvement"
              icon={Zap}
              trend="up"
              delay={0.3}
            />
          </div>

          <CostTrendChart />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">AI Recommendations</h2>
              <span className="text-sm text-muted-foreground">Updated 2 minutes ago</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.slice(0, 4).map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  title={rec.title}
                  description={rec.description}
                  savings={`$${rec.savings.toFixed(2)}/mo`}
                  impact={rec.impact}
                  service={rec.service}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;