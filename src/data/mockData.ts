import { faker } from '@faker-js/faker';
import { Client, Report, HealthData, Analytics } from '../types';

export const generateMockClients = (count: number): Client[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    // No avatar field - completely removed
    lastVisit: faker.date.recent({ days: 30 }),
    nextAppointment: Math.random() > 0.3 ? faker.date.future({ days: 14 }) : undefined,
    healthProtocol: faker.helpers.arrayElement([
      'Weight Management Protocol',
      'Metabolic Health Optimization',
      'Athletic Performance Enhancement',
      'Chronic Disease Management',
      'Digestive Health Protocol',
      'Hormonal Balance Program'
    ]),
    adherenceScore: Number(faker.number.float({ min: 60, max: 100 }).toFixed(1)),
    progressScore: Number(faker.number.float({ min: 50, max: 95 }).toFixed(1))
  }));
};

export const generateMockReports = (clients: Client[]): Report[] => {
  const reports = [];
  
  // First, create specific test reports to demonstrate PDF functionality
  if (clients.length >= 2) {
    reports.push({
      id: 'test-report-1',
      clientId: clients[0].id,
      clientName: clients[0].name,
      type: 'monthly' as const,
      status: 'review' as const, // This should show "Generate PDF"
      deadline: new Date('2025-12-24'),
      createdAt: new Date('2025-12-10'),
      lastModified: new Date('2025-12-12'),
      template: 'I.W.I.L. Comprehensive Body-Mind-Health Analysis',
      completionPercentage: 85
    });
    
    reports.push({
      id: 'test-report-2',
      clientId: clients[1].id,
      clientName: clients[1].name,
      type: 'weekly' as const,
      status: 'sent' as const, // This should show "View PDF"
      deadline: new Date('2025-12-21'),
      createdAt: new Date('2025-12-08'),
      lastModified: new Date('2025-12-10'),
      template: 'I.W.I.L. Peptide Therapy Progress Report',
      completionPercentage: 100
    });
  }
  
  // Then generate additional random reports
  const additionalReports = Array.from({ length: 23 }, () => {
    const client = faker.helpers.arrayElement(clients);
    return {
      id: faker.string.uuid(),
      clientId: client.id,
      clientName: client.name,
      type: faker.helpers.arrayElement(['weekly', 'monthly', 'quarterly', 'custom'] as const),
      status: faker.helpers.arrayElement(['draft', 'review', 'approved', 'sent'] as const),
      deadline: faker.date.future({ days: 30 }),
      createdAt: faker.date.recent({ days: 14 }),
      lastModified: faker.date.recent({ days: 7 }),
      template: faker.helpers.arrayElement([
        'I.W.I.L. Comprehensive Body-Mind-Health Analysis',
        'I.W.I.L. Peptide Therapy Progress Report',
        'I.W.I.L. Genetic Health Disorder Analysis',
        'I.W.I.L. Nutritional Intervention Protocol',
        'I.W.I.L. Holistic Support Access Points'
      ]),
      completionPercentage: Number(faker.number.float({ min: 15, max: 100 }).toFixed(0))
    };
  });
  
  return [...reports, ...additionalReports];
};

export const generateMockHealthData = (clientId: string): HealthData[] => {
  return Array.from({ length: 12 }, (_, index) => ({
    date: new Date(2025, 11 - index, 1),
    weight: Number(faker.number.float({ min: 60, max: 90 }).toFixed(1)),
    bodyFat: Number(faker.number.float({ min: 8, max: 25 }).toFixed(1)),
    muscleGain: Number(faker.number.float({ min: -0.5, max: 2 }).toFixed(1)),
    energyLevel: Number(faker.number.float({ min: 1, max: 10 }).toFixed(1)),
    sleepQuality: Number(faker.number.float({ min: 1, max: 10 }).toFixed(1)),
    protocolAdherence: Number(faker.number.float({ min: 60, max: 100 }).toFixed(1))
  }));
};

export const mockAnalytics: Analytics = {
  totalReports: 1247,
  reportsSentThisMonth: 89,
  avgClientEngagement: 87.3,
  reportsAwaitingReview: 12,
  clientRetentionRate: 94.2
};
