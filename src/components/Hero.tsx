import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">AWS Cost Optimization on Autopilot</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          <span className="text-gradient bg-[length:200%_auto]">AutoInfra</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your autonomous AI agent that continuously monitors AWS infrastructure, 
          analyzes usage patterns, and delivers cost-saving recommendations in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            onClick={() => navigate('/signup')}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border hover:bg-card"
            onClick={() => navigate('/dashboard')}
          >
            View Demo
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-success">$2.4M+</div>
            <div className="text-sm text-muted-foreground">Saved This Month</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">1,247</div>
            <div className="text-sm text-muted-foreground">Active Resources</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-secondary">98%</div>
            <div className="text-sm text-muted-foreground">Cost Accuracy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;