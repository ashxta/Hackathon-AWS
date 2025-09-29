import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
  delay?: number;
}

const MetricsCard = ({ title, value, change, icon: Icon, trend, delay = 0 }: MetricsCardProps) => {
  const trendColor = trend === "down" ? "text-success" : "text-warning";
  
  return (
    <Card 
      className="card-glass p-6 hover:scale-105 transition-transform duration-300 animate-float"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className={`text-sm font-medium ${trendColor}`}>{change}</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;
