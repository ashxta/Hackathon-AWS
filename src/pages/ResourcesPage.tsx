import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Server, Database, HardDrive, Box } from 'lucide-react';
import { generateMockResources, Resource } from '@/lib/awsData';
import { format } from 'date-fns';

export const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  
  const allResources = useMemo(() => generateMockResources(), []);

  const filteredResources = useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || resource.type === filterType;
      const matchesState = filterState === 'all' || resource.state === filterState;
      
      return matchesSearch && matchesType && matchesState;
    });
  }, [allResources, searchTerm, filterType, filterState]);

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'EC2': return <Server className="w-4 h-4" />;
      case 'RDS': return <Database className="w-4 h-4" />;
      case 'EBS': return <HardDrive className="w-4 h-4" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  const getStateColor = (state: Resource['state']) => {
    switch (state) {
      case 'running': return 'bg-success/20 text-success border-success/30';
      case 'idle': return 'bg-warning/20 text-warning border-warning/30';
      case 'stopped': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Resources</h1>
            <p className="text-lg text-muted-foreground">
              Monitor and analyze your AWS infrastructure
            </p>
          </div>

          <Card className="card-glass p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="EC2">EC2</SelectItem>
                  <SelectItem value="RDS">RDS</SelectItem>
                  <SelectItem value="S3">S3</SelectItem>
                  <SelectItem value="EBS">EBS</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterState} onValueChange={setFilterState}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>CPU Usage</TableHead>
                    <TableHead>Monthly Cost</TableHead>
                    <TableHead>Last Accessed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-xs text-muted-foreground">{resource.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getResourceIcon(resource.type)}
                          <span>{resource.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStateColor(resource.state)}>
                          {resource.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{resource.region}</TableCell>
                      <TableCell>
                        {resource.cpuUtilization > 0 ? (
                          <span className={resource.cpuUtilization < 5 ? 'text-warning' : ''}>
                            {resource.cpuUtilization.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">${resource.cost.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(resource.lastAccessed), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found matching your filters</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;