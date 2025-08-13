import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Activity,
  Target,
  Heart,
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Analytics, Report, Client } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DashboardProps {
  analytics: Analytics;
  recentReports: Report[];
  clients: Client[];
}

export const Dashboard: React.FC<DashboardProps> = ({ analytics, recentReports, clients }) => {
  const recentClients = clients.slice(0, 5);

  const statsCards = [
    {
      title: 'Total Reports',
      value: analytics.totalReports.toLocaleString(),
      icon: FileText,
      color: 'blue',
      trend: '+12.5%',
      description: 'This quarter',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Clients',
      value: clients.length.toString(),
      icon: Users,
      color: 'green',
      trend: '+8.2%',
      description: 'In protocols',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Wellness Score',
      value: `${analytics.avgClientEngagement}%`,
      icon: Heart,
      color: 'purple',
      trend: '+3.2%',
      description: 'Client average',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      title: 'Pending Review',
      value: analytics.reportsAwaitingReview.toString(),
      icon: AlertTriangle,
      color: 'orange',
      trend: '-5',
      description: 'Awaiting approval',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50/20 to-green-50/20 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">IWIL Wellness Protocol</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Transformative health reporting & client management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-md`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{stat.description}</p>
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600">{stat.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Recent Wellness Reports</span>
                  </CardTitle>
                  <CardDescription>Latest client report activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.slice(0, 5).map((report) => (
                <motion.div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-300 bg-white"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className={`p-2 rounded-lg ${
                      report.status === 'sent' ? 'bg-green-100 text-green-600' :
                      report.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                      report.status === 'review' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {report.status === 'sent' ? <CheckCircle size={16} /> :
                       report.status === 'review' ? <AlertTriangle size={16} /> :
                       <Clock size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{report.clientName}</p>
                      <p className="text-xs text-gray-500">{report.template}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between">
                    <Badge variant={
                      report.status === 'sent' ? 'default' :
                      report.status === 'approved' ? 'secondary' :
                      report.status === 'review' ? 'destructive' : 'outline'
                    } className="capitalize text-xs">
                      {report.status}
                    </Badge>
                    <Progress value={report.completionPercentage} className="w-16 hidden md:block" />
                    <span className="text-xs text-gray-500 min-w-[55px] font-medium text-right">
                      {format(report.deadline, 'MMM dd')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full justify-start iwil-gradient text-white shadow-md hover:shadow-lg transition-all duration-300">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button size="sm" className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </CardContent>
          </Card>

          {/* Active Clients */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Heart className="h-5 w-5 text-pink-600" />
                <span>Active Clients</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-300">
                  <Avatar className="h-9 w-9 ring-2 ring-blue-100">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="iwil-gradient text-white font-semibold text-xs">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{client.name}</p>
                    <p className="text-xs text-gray-500 truncate">{client.healthProtocol}</p>
                  </div>
                  <Badge variant={
                    client.adherenceScore > 85 ? 'default' :
                    client.adherenceScore > 70 ? 'secondary' : 'destructive'
                  } className="text-xs">
                    {client.adherenceScore}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
