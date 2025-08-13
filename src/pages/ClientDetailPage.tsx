import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Mail,
  Phone,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  LoaderCircle
} from 'lucide-react';
import { PDFPreviewDialog } from '../components/reports/PDFPreviewDialog';
import { Report, Client } from '../types';
import { useData } from '../hooks/useData';
import { getClients, getReports } from '../lib/api';

export const ClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  
  const { data: clients, isLoading: isLoadingClients } = useData<Client[]>(getClients);
  const { data: reports, isLoading: isLoadingReports } = useData<Report[]>(getReports);
  
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const client = clients?.find(c => c.id === clientId);
  const clientReports = reports?.filter(r => r.clientId === clientId) || [];

  if (isLoadingClients || isLoadingReports) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Client Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">The client you are looking for does not exist.</p>
            <Link to="/clients">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clients
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
    <>
      <PDFPreviewDialog 
        isOpen={!!previewReport}
        onOpenChange={() => setPreviewReport(null)}
        report={previewReport}
        client={client}
      />
      <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50/20 to-green-50/20 min-h-full">
        <div className="flex items-center justify-between">
          <Link to="/clients">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
          <Button className="iwil-gradient text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-blue-100 shadow-lg">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="iwil-gradient text-white font-semibold text-2xl">
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-gray-900">{client.name}</CardTitle>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center p-4 bg-gray-50/70 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Last Session</p>
                <p className="font-semibold text-gray-800">{format(new Date(client.lastVisit), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Session</p>
                <p className="font-semibold text-green-600">
                  {client.nextAppointment ? format(new Date(client.nextAppointment), 'MMM dd, yyyy') : 'Not Scheduled'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adherence</p>
                <p className="font-semibold text-blue-600">{client.adherenceScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="health-data">Health Data</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Wellness Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50/70 to-green-50/70 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-1">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Current Wellness Protocol</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{client.healthProtocol}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Protocol Adherence</span>
                      <span className="font-bold text-gray-900">{client.adherenceScore}%</span>
                    </div>
                    <Progress value={client.adherenceScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Overall Progress</span>
                      <span className="font-bold text-gray-900">{client.progressScore}%</span>
                    </div>
                    <Progress value={client.progressScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Client Reports</CardTitle>
                <CardDescription>All reports generated for {client.name}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {clientReports.map((report) => (
                  <div key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors bg-white">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                        {getStatusIcon(report.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{report.template}</p>
                        <p className="text-xs text-gray-500">Due: {format(new Date(report.deadline), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between">
                      <Badge variant={getStatusVariant(report.status)} className="capitalize text-xs">
                        {report.status}
                      </Badge>
                      <Progress value={report.completionPercentage} className="w-20" />
                      <Button variant="outline" size="sm" onClick={() => setPreviewReport(report)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
                {clientReports.length === 0 && <p className="text-center text-gray-500 py-4">No reports found for this client.</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="health-data">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Health Data Trends</CardTitle>
                <CardDescription>Visualizing progress over time for {client.name}.</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-16">
                <p className="text-gray-600">Health data visualization charts are coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
