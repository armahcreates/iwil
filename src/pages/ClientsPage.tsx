import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Calendar,
  TrendingUp,
  User,
  Heart,
  Sparkles,
  LoaderCircle,
  FileText
} from 'lucide-react';
import { Client } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { PDFViewer } from '../components/pdf/PDFViewer';
// Avatar imports removed - no avatars displayed
import { useData } from '../hooks/useData';
import { getClients } from '../lib/api';

export const ClientsPage: React.FC = () => {
  const { data: clients, isLoading, error } = useData<Client[]>(getClients);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.healthProtocol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-green-600/5"></div>
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
              <h3 className="text-xl font-bold text-slate-800 mb-2">Loading Clients</h3>
              <p className="text-slate-600 font-medium">Retrieving your client database...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-orange-50/20"></div>
        <div className="relative p-6 sm:p-8 md:p-12">
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <User className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Clients</h3>
              <p className="text-slate-600 font-medium mb-4">
                Error loading clients: {error.message}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Again
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-green-600/5"></div>
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
                    <Heart className="text-white" size={28} />
                  </div>
                  <div className="absolute -inset-2 iwil-gradient rounded-2xl opacity-20 blur-lg animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black iwil-gradient-text tracking-tight">
                    Client Management
                  </h1>
                  <p className="text-slate-600 text-sm md:text-lg mt-1 font-medium">
                    Holistic health protocol & I.W.I.L. tracking
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
              <Button variant="outline" size="sm" className="border-blue-200/60 text-blue-700 hover:bg-blue-50/80 backdrop-blur-sm bg-white/60">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <Card className="card-elevated border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-3 text-xl font-bold">
              <div className="p-2 iwil-gradient rounded-xl">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-800">Find I.W.I.L. Clients</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Search by name or I.W.I.L. protocol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-200/60 focus:border-blue-300 focus:ring-blue-300 bg-white/60 backdrop-blur-sm rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
            >
              <Link to={`/clients/${client.id}`} className="block h-full">
                <Card className="card-elevated border-0 h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80 group-hover:from-white/98 group-hover:to-white/90 transition-all duration-300"></div>
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center space-x-4">
                      {/* Avatar removed - no images displayed */}
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-800 font-bold group-hover:text-blue-700 transition-colors">{client.name}</CardTitle>
                        <CardDescription className="text-sm text-slate-600 font-medium">{client.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="p-4 bg-gradient-to-r from-blue-50/80 to-green-50/80 rounded-xl border border-blue-100/60 mb-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-700">I.W.I.L. Protocol</span>
                        </div>
                        <p className="text-sm text-slate-700 font-semibold">{client.healthProtocol}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-semibold">Adherence</span>
                            <span className="font-black text-slate-800">{client.adherenceScore}%</span>
                          </div>
                          <Progress value={client.adherenceScore} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-semibold">Progress</span>
                            <span className="font-black text-slate-800">{client.progressScore}%</span>
                          </div>
                          <Progress value={client.progressScore} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm bg-white/80 p-4 rounded-xl border border-white/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-semibold">Last Session</span>
                          <span className="text-slate-800 font-black">{format(new Date(client.lastVisit), 'MMM dd, yyyy')}</span>
                        </div>
                        {client.nextAppointment && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-semibold">Next Session</span>
                            <span className="text-emerald-600 font-black">
                              {format(new Date(client.nextAppointment), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1 border-blue-200/60 text-blue-700 hover:bg-blue-50/80 backdrop-blur-sm bg-white/60 pointer-events-none rounded-xl font-semibold">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Progress
                      </Button>
                      <PDFViewer
                        client={client}
                        report={{
                          id: `R${client.id.padStart(3, '0')}`,
                          clientId: client.id,
                          clientName: client.name,
                          type: 'monthly',
                          status: 'approved',
                          deadline: client.nextAppointment || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                          lastModified: new Date(),
                          template: 'I.W.I.L. Comprehensive Body-Mind-Health Analysis',
                          completionPercentage: 95
                        }}
                        trigger={
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300">
                            <FileText className="mr-2 h-4 w-4" />
                            Report PDF
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

        {filteredClients.length === 0 && !isLoading && (
          <Card className="card-elevated border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80"></div>
            <CardContent className="relative text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 iwil-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">No clients found</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto font-medium">
                  Try adjusting your search or add a new client to begin their I.W.I.L. journey.
                </p>
                <Button className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl font-semibold">
                  <Plus className="mr-2 h-5 w-5" />
                  Add First Client
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
