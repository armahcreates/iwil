import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Eye,
  Edit,
  Send,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { Report } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

interface ReportManagementProps {
  reports: Report[];
}

export const ReportManagement: React.FC<ReportManagementProps> = ({ reports }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="text-green-600" size={16} />;
      case 'approved': return <CheckCircle className="text-blue-600" size={16} />;
      case 'review': return <AlertTriangle className="text-orange-600" size={16} />;
      default: return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'approved': return 'secondary';
      case 'review': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50/20 to-green-50/20 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">Report Management</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Client wellness reporting workflow</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by client or template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <div className="grid grid-cols-2 md:flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="sent">Sent</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="all">All Types</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">{report.clientName}</CardTitle>
                    <CardDescription className="mt-1 text-sm text-gray-600">{report.template}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 -mr-2 -mt-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <Badge variant={getStatusVariant(report.status)} className="capitalize text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="capitalize border-blue-200 text-blue-700 text-xs">
                      {report.type}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-semibold text-gray-900">{report.completionPercentage}%</span>
                    </div>
                    <Progress value={report.completionPercentage} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm mt-3">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-semibold text-gray-900">{format(report.deadline, 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-200 hover:bg-gray-50">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {report.status === 'approved' && (
                    <Button size="sm" className="flex-1 iwil-gradient text-white shadow-md hover:shadow-lg">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 iwil-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
              Try adjusting your search or filter criteria.
            </p>
            <Button className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Create New Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
