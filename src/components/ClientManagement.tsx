import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Calendar,
  TrendingUp,
  User,
  Heart,
  Sparkles,
  Target
} from 'lucide-react';
import { Client } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ClientManagementProps {
  clients: Client[];
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ clients }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.healthProtocol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdherenceVariant = (score: number) => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50/20 to-green-50/20 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">Client Management</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Holistic health protocol & wellness tracking</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button size="sm" className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Find Wellness Clients</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search by name or wellness protocol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-100 shadow-md">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="iwil-gradient text-white font-semibold">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">{client.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{client.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-gradient-to-r from-blue-50/70 to-green-50/70 rounded-lg border border-blue-100 mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">Wellness Protocol</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{client.healthProtocol}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">Adherence</span>
                        <span className="font-bold text-gray-900">{client.adherenceScore}%</span>
                      </div>
                      <Progress value={client.adherenceScore} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-bold text-gray-900">{client.progressScore}%</span>
                      </div>
                      <Progress value={client.progressScore} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-1 text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Last Session</span>
                      <span className="text-gray-900 font-semibold">{format(client.lastVisit, 'MMM dd, yyyy')}</span>
                    </div>
                    {client.nextAppointment && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Next Session</span>
                        <span className="text-green-600 font-bold">
                          {format(client.nextAppointment, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Progress
                  </Button>
                  <Button size="sm" className="flex-1 iwil-gradient text-white shadow-md hover:shadow-lg">
                    <Target className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 iwil-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
              Try adjusting your search or add a new client to begin their wellness journey.
            </p>
            <Button className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Add First Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
