import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getSql } from './lib/db';
import { getStore } from '@netlify/blobs';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'GET') {
    try {
      const sql = getSql();
      const result = await sql`SELECT id, name, email, avatar_key, last_visit, next_appointment, health_protocol, adherence_score, progress_score FROM clients ORDER BY created_at DESC`;
      const clients = (Array.isArray(result) ? result : []) as Array<Record<string, any>>;

      const clientsWithAvatarUrl = clients.map((client) => ({
        ...client,
        // Construct the avatar URL to be fetched via our /api/avatars endpoint
        avatar: client.avatar_key ? `/api/avatars/${client.avatar_key}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`
      }));

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientsWithAvatarUrl),
      };
    } catch (error) {
      console.error('Falling back to mock clients due to DB error:', error);
      // Fallback data for local development when DATABASE_URL is missing/invalid
      const fallbackClients = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          avatar_key: undefined,
          last_visit: '2024-12-15T00:00:00Z',
          next_appointment: '2024-12-30T00:00:00Z',
          health_protocol: 'Metabolic Optimization Protocol',
          adherence_score: 92.5,
          progress_score: 87.3,
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          avatar_key: undefined,
          last_visit: '2024-12-18T00:00:00Z',
          next_appointment: '2025-01-02T00:00:00Z',
          health_protocol: 'Athletic Performance Enhancement',
          adherence_score: 89.2,
          progress_score: 91.8,
        },
        {
          id: '3',
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          avatar_key: undefined,
          last_visit: '2024-12-12T00:00:00Z',
          next_appointment: '2024-12-28T00:00:00Z',
          health_protocol: 'Hormone Balance Program',
          adherence_score: 95.8,
          progress_score: 93.4,
        },
      ];

      const clientsWithAvatarUrl = fallbackClients.map(client => ({
        ...client,
        avatar: client.avatar_key ? `/api/avatars/${client.avatar_key}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(client.name)}`
      }));

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientsWithAvatarUrl),
      };
    }
  }

  // Add POST, PUT, DELETE methods here later

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  };
};

export { handler };
