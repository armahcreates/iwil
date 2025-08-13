import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  FileSpreadsheet,
  Edit,
  Copy,
  Eye,
  TrendingUp,
  CheckCircle,
  Heart,
  Activity,
  Target,
  Sparkles,
  Download
} from 'lucide-react';
import { wellnessTemplates } from '../data/templateData';
import { Template } from '../types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [templates] = useState<Template[]>(wellnessTemplates);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && template.isActive;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness': return <Heart className="h-4 w-4" />;
      case 'progress': return <TrendingUp className="h-4 w-4" />;
      case 'assessment': return <Activity className="h-4 w-4" />;
      case 'protocol': return <Target className="h-4 w-4" />;
      default: return <FileSpreadsheet className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wellness': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'assessment': return 'bg-green-100 text-green-700 border-green-200';
      case 'protocol': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50/20 to-green-50/20 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <FileSpreadsheet className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">Report Templates</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Professional templates for client reporting</p>
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

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filter & Search Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            >
              <option value="all">All Categories</option>
              <option value="wellness">Wellness</option>
              <option value="progress">Progress</option>
              <option value="assessment">Assessment</option>
              <option value="protocol">Protocol</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(template.category)}
                      <Badge className={`capitalize text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{template.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-3 gap-4 text-center p-3 bg-gray-50/70 rounded-lg border border-gray-100 mb-4">
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-blue-600">{template.sections.length}</p>
                      <p className="text-xs text-gray-500">Sections</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-green-600">{template.usageCount}</p>
                      <p className="text-xs text-gray-500">Uses</p>
                    </div>
                    <div className="space-y-1">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Modified</span>
                    <span className="font-semibold text-gray-900">
                      {format(template.lastModified, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-200 hover:bg-gray-50">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="icon" className="border-green-200 text-green-700 hover:bg-green-50">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 iwil-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
              Try adjusting your search or filter criteria.
            </p>
            <Button className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
