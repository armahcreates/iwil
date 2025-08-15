import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Client } from '../../types';
import { format } from 'date-fns';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  clients?: Client[];
  onSave: (appointment: AppointmentData) => void;
}

export interface AppointmentData {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'appointment' | 'consultation' | 'followup' | 'deadline';
  location: string;
  notes: string;
  meetingType: 'in-person' | 'video' | 'phone';
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  clients = [],
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<AppointmentData>>({
    title: '',
    clientId: '',
    clientName: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '10:00',
    type: 'appointment',
    location: '',
    notes: '',
    meetingType: 'in-person'
  });

  const appointmentTypes = [
    { value: 'appointment', label: 'Appointment', icon: User, color: 'bg-slate-100 text-slate-700' },
    { value: 'consultation', label: 'Consultation', icon: Video, color: 'bg-purple-100 text-purple-700' },
    { value: 'followup', label: 'Follow-up', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { value: 'deadline', label: 'Deadline', icon: AlertTriangle, color: 'bg-red-100 text-red-700' }
  ];

  const meetingTypes = [
    { value: 'in-person', label: 'In-Person', icon: MapPin },
    { value: 'video', label: 'Video Call', icon: Video },
    { value: 'phone', label: 'Phone Call', icon: Phone }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = clients.find(c => c.id === formData.clientId);
    
    const appointmentData: AppointmentData = {
      id: `appointment-${Date.now()}`,
      title: formData.title || `${formData.type} with ${selectedClient?.name || 'Client'}`,
      clientId: formData.clientId || '',
      clientName: selectedClient?.name || '',
      date: selectedDate,
      startTime: formData.startTime || '09:00',
      endTime: formData.endTime || '10:00',
      type: formData.type as AppointmentData['type'] || 'appointment',
      location: formData.location || '',
      notes: formData.notes || '',
      meetingType: formData.meetingType as AppointmentData['meetingType'] || 'in-person'
    };

    onSave(appointmentData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      clientId: '',
      clientName: '',
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      type: 'appointment',
      location: '',
      notes: '',
      meetingType: 'in-person'
    });
  };

  const handleInputChange = (field: keyof AppointmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 iwil-gradient rounded-xl flex items-center justify-center">
                    <Calendar className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Schedule Appointment</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Appointment Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {appointmentTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            type="button"
                            onClick={() => handleInputChange('type', type.value)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                              formData.type === type.value
                                ? 'border-slate-300 bg-slate-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`p-1.5 rounded-full ${type.color}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium">{type.label}</span>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title (Optional)
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter appointment title"
                    className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Meeting Type
                  </label>
                  <div className="flex space-x-3">
                    {meetingTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange('meetingType', type.value)}
                          className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.meetingType === type.value
                              ? 'border-slate-300 bg-slate-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{type.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={
                      formData.meetingType === 'video' 
                        ? 'Video call link will be generated'
                        : formData.meetingType === 'phone'
                        ? 'Phone number'
                        : 'Enter location address'
                    }
                    className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes or preparation instructions"
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
