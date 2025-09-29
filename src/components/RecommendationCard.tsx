import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingDown } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  savings: string;
  impact: "high" | "medium" | "low";
  service: string;
  delay?: number;
}

const RecommendationCard = ({ 
  title, 
  description, 
  savings, 
  impact, 
  service,
  delay = 0 
}: RecommendationCardProps) => {
  const impactColors = {
    high: "bg-success/20 text-success border-success/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    low: "bg-muted text-muted-foreground border-muted",
  };

  return (
    <Card 
      className="card-glass p-6 space-y-4 hover:border-primary/50 transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {service}
            </Badge>
            <Badge variant="outline" className={impactColors[impact]}>
              {impact} impact
            </Badge>
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-success">
          <TrendingDown className="w-5 h-5" />
          <span className="text-lg font-bold">{savings}</span>
          <span className="text-sm text-muted-foreground">potential savings</span>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Apply
        </Button>
      </div>
    </Card>
  );
};

export default RecommendationCard;
