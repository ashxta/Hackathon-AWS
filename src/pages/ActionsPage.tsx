import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Play, Shield, CheckCircle2, XCircle, Clock, TrendingDown } from 'lucide-react';
import { generateMockRecommendations, Recommendation } from '@/lib/awsData';
import { toast } from 'sonner';

export const ActionsPage = () => {
  const [safeMode, setSafeMode] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => generateMockRecommendations());
  const [selectedAction, setSelectedAction] = useState<Recommendation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const stats = useMemo(() => {
    const pending = recommendations.filter(r => r.status === 'pending').length;
    const applied = recommendations.filter(r => r.status === 'applied').length;
    const totalSavings = recommendations
      .filter(r => r.status === 'applied')
      .reduce((sum, r) => sum + r.savings, 0);
    
    return { pending, applied, totalSavings };
  }, [recommendations]);

  const handleApplyAction = (recommendation: Recommendation) => {
    setSelectedAction(recommendation);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedAction) return;

    // Simulate applying the action
    setTimeout(() => {
      setRecommendations(prev =>
        prev.map(r =>
          r.id === selectedAction.id
            ? { ...r, status: 'applied' as const }
            : r
        )
      );
      
      toast.success(`Action applied successfully!`, {
        description: `${selectedAction.title} - Saving $${selectedAction.savings.toFixed(2)}/mo`
      });
      
      setIsDialogOpen(false);
      setSelectedAction(null);
    }, 1000);
  };

  const handleRejectAction = (id: string) => {
    setRecommendations(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'rejected' as const } : r
      )
    );
    toast.info('Recommendation dismissed');
  };

  const getImpactColor = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getStatusIcon = (status: Recommendation['status']) => {
    switch (status) {
      case 'applied': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Actions</h1>
              <p className="text-lg text-muted-foreground">
                Execute cost-saving recommendations with AI assistance
              </p>
            </div>

            <Card className="card-glass p-4">
              <div className="flex items-center space-x-3">
                <Shield className={`w-5 h-5 ${safeMode ? 'text-success' : 'text-warning'}`} />
                <div className="flex-1">
                  <Label htmlFor="safe-mode" className="text-sm font-medium">
                    Safe Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {safeMode ? 'Recommend only' : 'Auto-execute enabled'}
                  </p>
                </div>
                <Switch
                  id="safe-mode"
                  checked={safeMode}
                  onCheckedChange={setSafeMode}
                />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-glass p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Pending Actions</span>
                </div>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
            </Card>

            <Card className="card-glass p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Applied Actions</span>
                </div>
                <p className="text-3xl font-bold">{stats.applied}</p>
              </div>
            </Card>

            <Card className="card-glass p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm">Total Savings</span>
                </div>
                <p className="text-3xl font-bold text-success">
                  ${stats.totalSavings.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recommendations</h2>
            
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="card-glass p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getStatusIcon(rec.status)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{rec.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {rec.service}
                            </Badge>
                            <Badge variant="outline" className={getImpactColor(rec.impact)}>
                              {rec.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-success" />
                            <span className="text-lg font-bold text-success">
                              ${rec.savings.toFixed(2)}/mo
                            </span>
                            <span className="text-sm text-muted-foreground">potential savings</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      {rec.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleApplyAction(rec)}
                            className="gap-2 bg-success hover:bg-success/90"
                          >
                            <Play className="w-4 h-4" />
                            Apply
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRejectAction(rec.id)}
                          >
                            Dismiss
                          </Button>
                        </>
                      )}
                      {rec.status === 'applied' && (
                        <Badge className="bg-success/20 text-success border-success/30">
                          Applied
                        </Badge>
                      )}
                      {rec.status === 'rejected' && (
                        <Badge variant="outline" className="bg-muted">
                          Dismissed
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction && (
                <div className="space-y-3 mt-2">
                  <p>You are about to apply the following action:</p>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <p className="font-semibold">{selectedAction.title}</p>
                    <p className="text-sm">{selectedAction.description}</p>
                    <p className="text-sm">
                      <span className="font-medium">Estimated savings:</span>{' '}
                      <span className="text-success font-bold">
                        ${selectedAction.savings.toFixed(2)}/month
                      </span>
                    </p>
                  </div>
                  {safeMode ? (
                    <p className="text-sm text-warning">
                      ⚠️ Safe mode is enabled. This action will be logged but not executed automatically.
                    </p>
                  ) : (
                    <p className="text-sm text-destructive">
                      ⚠️ This action will be executed immediately on your AWS infrastructure.
                    </p>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} className="bg-success hover:bg-success/90">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsPage;