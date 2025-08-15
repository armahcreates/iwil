import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Eye,
  Edit,
  Send,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  MoreHorizontal,
  LoaderCircle,
  FilePlus
} from 'lucide-react';
import { Report, Client } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { useData } from '../hooks/useData';
import { getReports, getClients } from '../lib/api';
import { CreateReportDialog } from '../components/reports/CreateReportDialog';
import { PDFPreviewModal } from '../components/PDFPreviewModal';
import { pdfGenerator, ReportData } from '../lib/pdfGenerator';

export const ReportsPage: React.FC = () => {
  const { data: reports, isLoading: isLoadingReports } = useData<Report[]>(getReports);
  const { data: clients, isLoading: isLoadingClients } = useData<Client[]>(getClients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState<ReportData | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const filteredReports = reports?.filter(report => {
    const matchesSearch = report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="text-green-600" size={16} />;
      case 'approved': return <CheckCircle className="text-slate-600" size={16} />;
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

  const convertReportToReportData = (report: Report): ReportData => {
    return {
      id: report.id,
      clientName: report.clientName,
      clientEmail: `${report.clientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      template: report.template,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
      data: {
        assessment: {
          overallScore: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
          categories: [
            {
              name: 'Physical Wellness',
              score: Math.floor(Math.random() * 30) + 70,
              recommendations: ['Increase daily activity', 'Improve sleep schedule']
            },
            {
              name: 'Mental Wellness',
              score: Math.floor(Math.random() * 30) + 70,
              recommendations: ['Practice mindfulness', 'Stress management techniques']
            },
            {
              name: 'Nutritional Wellness',
              score: Math.floor(Math.random() * 30) + 70,
              recommendations: ['Balanced diet plan', 'Hydration goals']
            }
          ]
        },
        recommendations: [
          'Continue current wellness practices',
          'Focus on identified improvement areas',
          'Schedule regular check-ins'
        ],
        nextSteps: [
          'Review recommendations with healthcare provider',
          'Implement suggested lifestyle changes',
          'Schedule follow-up assessment in 3 months'
        ],
        notes: 'Client shows good engagement with wellness protocols. Continue monitoring progress and adjust recommendations as needed.'
      }
    };
  };

  const handleViewPDF = (report: Report) => {
    const reportData = convertReportToReportData(report);
    setSelectedReportData(reportData);
    setPdfPreviewOpen(true);
  };

  const handleGeneratePDF = async (report: Report) => {
    setGeneratingPdf(report.id);
    try {
      const reportData = convertReportToReportData(report);
      await pdfGenerator.generateAndDownload(reportData);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setGeneratingPdf(null);
    }
  };

  return (
    <>
      <CreateReportDialog 
        isOpen={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        clients={clients}
      />
      <div className="space-y-6 p-4 sm:p-6 md:p-8 iwil-gradient-subtle min-h-full">
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
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Filter className="h-5 w-5 text-slate-600" />
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
                  className="pl-10 border-gray-200 focus:border-slate-300 focus:ring-slate-300"
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

        {(isLoadingReports || isLoadingClients) ? (
          <div className="flex h-64 items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
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
                        <span className="font-semibold text-gray-900">{format(new Date(report.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                      {(report.status === 'approved' || report.status === 'sent') ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                          onClick={() => handleViewPDF(report)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View PDF
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                          onClick={() => handleGeneratePDF(report)}
                          disabled={generatingPdf === report.id}
                        >
                          {generatingPdf === report.id ? (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FilePlus className="mr-2 h-4 w-4" />
                          )}
                          {generatingPdf === report.id ? 'Generating...' : 'Generate PDF'}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50">
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
        )}

        {filteredReports.length === 0 && !isLoadingReports && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 iwil-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
                Try adjusting your search or filter criteria.
              </p>
              <Button className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <PDFPreviewModal
        isOpen={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        reportData={selectedReportData}
      />
    </>
  );
};
