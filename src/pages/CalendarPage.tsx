import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  Video,
  Download
} from 'lucide-react';
import { calendarEvents } from '../data/calendarData';
import { CalendarEvent, Client } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, isBefore, startOfDay, getDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AppointmentModal, AppointmentData } from '../components/calendar/AppointmentModal';
import { useData } from '../hooks/useData';
import { getClients } from '../lib/api';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  
  const { data: clients } = useData<Client[]>(getClients);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const startingDayIndex = getDay(firstDayOfMonth);

  const selectedDateEvents = events.filter(event => isSameDay(event.date, selectedDate)).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <User className="h-3 w-3" />;
      case 'consultation': return <Video className="h-3 w-3" />;
      case 'deadline': return <AlertTriangle className="h-3 w-3" />;
      case 'followup': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-slate-100 text-slate-700';
      case 'consultation': return 'bg-purple-100 text-purple-700';
      case 'deadline': return 'bg-red-100 text-red-700';
      case 'followup': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const handleSaveAppointment = (appointmentData: AppointmentData) => {
    const newEvent: CalendarEvent = {
      id: appointmentData.id,
      title: appointmentData.title,
      date: appointmentData.date,
      startTime: appointmentData.startTime,
      endTime: appointmentData.endTime,
      type: appointmentData.type,
      clientId: appointmentData.clientId,
      clientName: appointmentData.clientName,
      location: appointmentData.location,
      notes: appointmentData.notes,
      status: 'scheduled'
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const upcomingEvents = events
    .filter(event => !isBefore(event.date, startOfDay(new Date())))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 iwil-gradient-subtle min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <CalendarIcon className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">Wellness Calendar</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Schedule appointments and track deadlines</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setAppointmentModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center w-32 sm:w-40">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-gray-500 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
                {daysInMonth.map(day => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <motion.div
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`relative p-1.5 sm:p-2 min-h-[60px] sm:min-h-[80px] border rounded-lg cursor-pointer transition-colors duration-200 ${
                        isSameDay(day, selectedDate) ? 'bg-slate-100 border-slate-300' : 'border-gray-100 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className={`text-xs sm:text-sm font-medium ${isToday(day) ? 'bg-slate-600 text-white rounded-full flex items-center justify-center h-6 w-6' : 'text-gray-800'}`}>
                        {format(day, 'd')}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map(event => (
                          <div key={event.id} className={`w-full h-1.5 rounded-full ${getEventColor(event.type).split(' ')[0]}`} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {isToday(selectedDate) ? "Today's Schedule" : format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>{selectedDateEvents.length} events scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`p-1 rounded-full ${getEventColor(event.type)}`}>{getEventIcon(event.type)}</div>
                      <span className="text-sm font-semibold text-gray-900">{event.startTime}</span>
                      <Badge variant="outline" className={`capitalize text-xs ${getEventColor(event.type)} border-0`}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{event.title}</p>
                    {event.location && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{event.location}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No events scheduled.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Upcoming</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 rounded-lg transition-all duration-200">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {event.clientName || event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(event.date, 'MMM d')} at {event.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        selectedDate={selectedDate}
        clients={clients || []}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};
