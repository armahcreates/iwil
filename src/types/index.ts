export interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastVisit: Date;
  nextAppointment?: Date;
  healthProtocol: string;
  adherenceScore: number;
  progressScore: number;
}

export interface Report {
  id: string;
  clientId: string;
  clientName: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  status: 'draft' | 'review' | 'approved' | 'sent';
  deadline: Date;
  createdAt: Date;
  lastModified: Date;
  template: string;
  completionPercentage: number;
}

export interface HealthData {
  date: Date;
  weight: number;
  bodyFat: number;
  muscleGain: number;
  energyLevel: number;
  sleepQuality: number;
  protocolAdherence: number;
}

export interface Analytics {
  totalReports: number;
  reportsSentThisMonth: number;
  avgClientEngagement: number;
  reportsAwaitingReview: number;
  clientRetentionRate: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'wellness' | 'progress' | 'assessment' | 'protocol';
  sections: TemplateSection[];
  isActive: boolean;
  createdAt: Date;
  lastModified: Date;
  usageCount: number;
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  fields: TemplateField[];
  order: number;
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'appointment' | 'deadline' | 'consultation' | 'followup';
  clientId?: string;
  clientName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  location?: string;
}
