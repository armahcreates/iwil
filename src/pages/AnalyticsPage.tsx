import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useData } from '../hooks/useData';
import { getClients, getReports } from '../lib/api';
import { mockAnalytics } from '../data/mockData';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: clients } = useData(getClients);
  const { data: reports } = useData(getReports);

  // Mock analytics data - in real app, this would come from API
  const metrics: MetricCard[] = [
    {
      title: 'Total Clients',
      value: clients?.length || 0,
      change: 12.5,
      icon: Users,
      color: 'iwil-gradient',
      description: 'Active clients this month'
    },
    {
      title: 'Reports Generated',
      value: mockAnalytics.totalReports,
      change: 8.2,
      icon: FileText,
      color: 'iwil-gradient-success',
      description: 'Total reports created'
    },
    {
      title: 'Avg Engagement',
      value: `${mockAnalytics.avgClientEngagement}%`,
      change: 5.7,
      icon: Activity,
      color: 'bg-slate-500',
      description: 'Client engagement score'
    },
    {
      title: 'Retention Rate',
      value: `${mockAnalytics.clientRetentionRate}%`,
      change: 2.1,
      icon: Award,
      color: 'bg-slate-600',
      description: 'Client retention this quarter'
    }
  ];

  // Mock chart data with IWIL colors
  const weeklyReports: ChartData[] = [
    { name: 'Mon', value: 12, color: '#475569' },
    { name: 'Tue', value: 19, color: '#475569' },
    { name: 'Wed', value: 15, color: '#475569' },
    { name: 'Thu', value: 22, color: '#475569' },
    { name: 'Fri', value: 18, color: '#475569' },
    { name: 'Sat', value: 8, color: '#475569' },
    { name: 'Sun', value: 5, color: '#475569' }
  ];

  const clientEngagement: ChartData[] = [
    { name: 'High Engagement', value: 65, color: '#475569' },
    { name: 'Medium Engagement', value: 25, color: '#64748b' },
    { name: 'Low Engagement', value: 10, color: '#94a3b8' }
  ];

  const reportStatus = reports ? [
    { name: 'Completed', value: reports.filter(r => r.status === 'sent').length, color: '#475569' },
    { name: 'In Review', value: reports.filter(r => r.status === 'review').length, color: '#64748b' },
    { name: 'Draft', value: reports.filter(r => r.status === 'draft').length, color: '#94a3b8' },
    { name: 'Approved', value: reports.filter(r => r.status === 'approved').length, color: '#334155' }
  ] : [];

  const topClients = clients?.slice(0, 5).map(client => ({
    name: client.name,
    score: client.adherenceScore,
    progress: client.progressScore
    // Avatar removed - no images displayed
  })) || [];

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 iwil-gradient-subtle min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">Analytics Dashboard</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Insights and performance metrics</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${metric.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${metric.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      {metric.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Reports Chart */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Weekly Report Activity</span>
            </CardTitle>
            <CardDescription>Reports generated this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyReports.map((day, index) => (
                <div key={day.name} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{day.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.value / 25) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: day.color }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-6">{day.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Engagement */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>Client Engagement</span>
            </CardTitle>
            <CardDescription>Engagement levels across all clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientEngagement.map((segment, index) => (
                <div key={segment.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{segment.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{segment.value}%</span>
                  </div>
                  <Progress 
                    value={segment.value} 
                    className="h-2"
                    style={{ 
                      '--progress-background': segment.color 
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Status Distribution */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Report Status</span>
            </CardTitle>
            <CardDescription>Current status of all reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{status.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {status.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Clients */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-600" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription>Clients with highest adherence scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={client.name} className="flex items-center space-x-3 p-3 hover:bg-gray-50/70 rounded-lg transition-colors">
                  <div className="relative">
                    {/* Avatar removed - no images displayed */}
                    <div className="w-10 h-10 iwil-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{client.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">Adherence:</span>
                      <span className="text-xs font-medium text-gray-700">{client.score}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{client.progress}%</div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-slate-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', action: 'New report generated', client: 'Sarah Johnson', type: 'report' },
              { time: '4 hours ago', action: 'Appointment scheduled', client: 'Michael Chen', type: 'appointment' },
              { time: '6 hours ago', action: 'Protocol updated', client: 'Emma Davis', type: 'protocol' },
              { time: '1 day ago', action: 'Assessment completed', client: 'James Wilson', type: 'assessment' },
              { time: '2 days ago', action: 'New client onboarded', client: 'Lisa Anderson', type: 'client' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50/70 rounded-lg transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'report' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'appointment' ? 'bg-green-100 text-green-600' :
                  activity.type === 'protocol' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'assessment' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'report' && <FileText className="h-4 w-4" />}
                  {activity.type === 'appointment' && <Calendar className="h-4 w-4" />}
                  {activity.type === 'protocol' && <Target className="h-4 w-4" />}
                  {activity.type === 'assessment' && <Activity className="h-4 w-4" />}
                  {activity.type === 'client' && <Users className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">Client: {activity.client}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
