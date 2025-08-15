import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Heart,
  ArrowUpRight,
  Sparkles,
  Zap,
  Clock,
  LoaderCircle
} from 'lucide-react';
import { Report, Client, Analytics } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
// Avatar imports removed - no avatars displayed
import { useData } from '../hooks/useData';
import { getClients, getReports } from '../lib/api';
import { Link } from 'react-router-dom';

const LoadingSkeleton = () => (
  <div className="min-h-full relative">
    <div className="absolute inset-0 iwil-gradient-subtle opacity-20"></div>
    <div className="relative p-6 sm:p-8 md:p-12">
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 iwil-gradient rounded-2xl flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <LoaderCircle className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          <div className="absolute -inset-4 iwil-gradient rounded-2xl opacity-20 blur-xl animate-pulse"></div>
        </motion.div>
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-slate-800 mb-2">Loading Dashboard</h3>
          <p className="text-slate-600 font-medium">Preparing your wellness insights...</p>
        </motion.div>
      </div>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { data: clients, isLoading: isLoadingClients } = useData<Client[]>(getClients);
  const { data: reports, isLoading: isLoadingReports } = useData<Report[]>(getReports);

  if (isLoadingClients || isLoadingReports) {
    return <LoadingSkeleton />;
  }

  if (!clients || !reports) {
    return (
      <div className="min-h-full relative">
        <div className="absolute inset-0 iwil-gradient-subtle opacity-20"></div>
        <div className="relative p-6 sm:p-8 md:p-12">
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 iwil-gradient rounded-2xl flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Dashboard</h3>
              <p className="text-slate-600 font-medium mb-4">
                There was an issue loading your dashboard data. Please try refreshing the page.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Refresh Page
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const analytics: Analytics = {
    totalReports: reports.length,
    reportsSentThisMonth: reports.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length,
    avgClientEngagement: clients.length > 0 ? Math.round(clients.reduce((acc, c) => acc + c.adherenceScore, 0) / clients.length) : 0,
    reportsAwaitingReview: reports.filter(r => r.status === 'review').length,
    clientRetentionRate: 94 // Placeholder
  };
  
  const recentReports = reports.slice(0, 5);
  const recentClients = clients.slice(0, 5);

  const statsCards = [
    {
      title: 'Total Reports',
      value: analytics.totalReports.toLocaleString(),
      icon: FileText,
      trend: '+12.5%',
      description: 'This quarter',
      gradient: 'iwil-gradient-primary'
    },
    {
      title: 'Active Clients',
      value: clients.length.toString(),
      icon: Users,
      trend: '+8.2%',
      description: 'In protocols',
      gradient: 'iwil-gradient'
    },
    {
      title: 'Wellness Score',
      value: `${analytics.avgClientEngagement}%`,
      icon: Heart,
      trend: '+3.2%',
      description: 'Client average',
      gradient: 'iwil-gradient'
    },
    {
      title: 'Pending Review',
      value: analytics.reportsAwaitingReview.toString(),
      icon: AlertTriangle,
      trend: '-5',
      description: 'Awaiting approval',
      gradient: 'iwil-gradient'
    }
  ];

  return (
    <div className="min-h-full relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 iwil-gradient-subtle opacity-20"></div>
        <div className="relative p-6 sm:p-8 md:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-4 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 iwil-gradient rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="text-white" size={28} />
                  </div>
                  <div className="absolute -inset-2 iwil-gradient rounded-2xl opacity-20 blur-lg animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black iwil-gradient-text tracking-tight">
                    IWIL Wellness Protocol
                  </h1>
                  <p className="text-slate-600 text-sm md:text-lg mt-1 font-medium">
                    Transformative health reporting & client management
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button variant="outline" size="sm" className="border-slate-200/60 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm bg-white/60">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              >
                <Card className="card-elevated border-0 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/60 group-hover:from-white/95 group-hover:to-white/80 transition-all duration-300"></div>
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-600 tracking-wide">
                      {stat.title}
                    </CardTitle>
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 font-medium">{stat.description}</p>
                      <motion.div 
                        className="flex items-center space-x-1.5 px-2 py-1 bg-emerald-50 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600">{stat.trend}</span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="card-elevated border-0 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                      <div className="p-2 iwil-gradient rounded-xl">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-slate-800">Recent Wellness Reports</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 font-medium mt-1">
                      Latest client report activity and progress updates
                    </CardDescription>
                  </motion.div>
                  <Link to="/reports">
                    <Button variant="outline" size="sm" className="border-slate-200/60 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm bg-white/60">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {recentReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-white/40 rounded-2xl hover:bg-white/80 transition-all duration-300 bg-white/60 backdrop-blur-sm group"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <motion.div 
                        className={`p-3 rounded-xl shadow-md ${
                          report.status === 'sent' ? 'bg-emerald-100 text-emerald-700 shadow-emerald-200' :
                          report.status === 'approved' ? 'bg-slate-100 text-slate-700 shadow-slate-200' :
                          report.status === 'review' ? 'bg-amber-100 text-amber-700 shadow-amber-200' :
                          'bg-slate-100 text-slate-600 shadow-slate-200'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {report.status === 'sent' ? <CheckCircle size={18} /> :
                         report.status === 'review' ? <AlertTriangle size={18} /> :
                         <Clock size={18} />}
                      </motion.div>
                      <div>
                        <p className="font-bold text-sm text-slate-800 group-hover:text-slate-900 transition-colors">{report.clientName}</p>
                        <p className="text-xs text-slate-500 font-medium">{report.template}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between">
                      <Badge 
                        variant={
                          report.status === 'sent' ? 'default' :
                          report.status === 'approved' ? 'secondary' :
                          report.status === 'review' ? 'destructive' : 'outline'
                        } 
                        className="capitalize text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {report.status}
                      </Badge>
                      <div className="hidden md:flex items-center space-x-2">
                        <Progress value={report.completionPercentage} className="w-20 h-2" />
                        <span className="text-xs text-slate-600 font-bold min-w-[35px]">
                          {report.completionPercentage}%
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 min-w-[55px] font-bold text-right bg-slate-50 px-2 py-1 rounded-lg">
                        {format(new Date(report.deadline), 'MMM dd')}
                      </span>
                    </div>
                  </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="card-elevated border-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center space-x-3 text-lg font-bold">
                    <div className="p-2 iwil-gradient rounded-xl">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-800">Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <Link to="/reports">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" className="w-full justify-start iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 rounded-xl font-semibold">
                        <FileText className="mr-3 h-5 w-5" />
                        Generate Report
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/clients">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" className="w-full justify-start border-slate-200/60 text-slate-700 hover:bg-slate-50/80 backdrop-blur-sm bg-white/60 h-11 rounded-xl font-semibold" variant="outline">
                        <Users className="mr-3 h-5 w-5" />
                        Add Client
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="card-elevated border-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center space-x-3 text-lg font-bold">
                    <div className="p-2 iwil-gradient rounded-xl">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-800">Active Clients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {recentClients.map((client, index) => (
                    <Link to={`/clients/${client.id}`} key={client.id}>
                      <motion.div 
                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50/70 transition-all duration-300 group bg-white/40 backdrop-blur-sm border border-white/40"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        {/* Avatar removed - no images displayed */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 truncate group-hover:text-slate-700 transition-colors">
                            {client.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate font-medium">{client.healthProtocol}</p>
                        </div>
                        <Badge 
                          variant={
                            client.adherenceScore > 85 ? 'default' :
                            client.adherenceScore > 70 ? 'secondary' : 'destructive'
                          } 
                          className="text-xs font-bold px-2 py-1 rounded-full shadow-sm"
                        >
                          {client.adherenceScore}%
                        </Badge>
                      </motion.div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
