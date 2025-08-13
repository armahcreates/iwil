import axios from 'axios';
import { Client, Report } from '../types';

const api = axios.create({
  baseURL: '/api',
});

type ApiClient = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_key?: string;
  last_visit: string;
  next_appointment?: string | null;
  health_protocol: string;
  adherence_score: number | string;
  progress_score: number | string;
};

type ApiReport = {
  id: string;
  client_id: string;
  client_name: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom' | string;
  status: 'draft' | 'review' | 'approved' | 'sent' | string;
  deadline: string;
  created_at: string;
  last_modified: string;
  template_name: string;
  completion_percentage: number | string;
};

function mapApiClient(apiClient: ApiClient): Client {
  return {
    id: apiClient.id,
    name: apiClient.name,
    email: apiClient.email,
    avatar:
      apiClient.avatar ||
      (apiClient.avatar_key
        ? `/api/avatars/${apiClient.avatar_key}`
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(apiClient.name)}`),
    lastVisit: new Date(apiClient.last_visit),
    nextAppointment: apiClient.next_appointment ? new Date(apiClient.next_appointment) : undefined,
    healthProtocol: apiClient.health_protocol,
    adherenceScore: typeof apiClient.adherence_score === 'string' ? Number(apiClient.adherence_score) : apiClient.adherence_score,
    progressScore: typeof apiClient.progress_score === 'string' ? Number(apiClient.progress_score) : apiClient.progress_score,
  };
}

function mapApiReport(apiReport: ApiReport): Report {
  const type = (apiReport.type as Report['type']) ?? 'custom';
  const status = (apiReport.status as Report['status']) ?? 'draft';

  return {
    id: apiReport.id,
    clientId: apiReport.client_id,
    clientName: apiReport.client_name,
    type,
    status,
    deadline: new Date(apiReport.deadline),
    createdAt: new Date(apiReport.created_at),
    lastModified: new Date(apiReport.last_modified),
    template: apiReport.template_name,
    completionPercentage:
      typeof apiReport.completion_percentage === 'string'
        ? Number(apiReport.completion_percentage)
        : apiReport.completion_percentage,
  };
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get<ApiClient[]>('/clients');
  return response.data.map(mapApiClient);
};

export const getReports = async (): Promise<Report[]> => {
  const response = await api.get<ApiReport[]>('/reports');
  return response.data.map(mapApiReport);
};

// Add other API functions (getTemplates, getCalendarEvents, createReport, etc.) here
