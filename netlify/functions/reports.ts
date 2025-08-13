import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getSql } from './lib/db';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'GET') {
    try {
      const sql = getSql();
      const reports = await sql`
        SELECT r.id, r.client_id, c.name as client_name, r.type, r.status, r.deadline, r.created_at, r.last_modified, r.template_name, r.completion_percentage 
        FROM reports r
        JOIN clients c ON r.client_id = c.id
        ORDER BY r.last_modified DESC
      `;
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reports),
      };
    } catch (error) {
      console.error('Falling back to mock reports due to DB error:', error);
      // Fallback data for local development when DATABASE_URL is missing/invalid
      const fallbackReports = [
        {
          id: 'R001',
          client_id: '1',
          client_name: 'Sarah Johnson',
          type: 'monthly',
          status: 'review',
          deadline: '2024-12-25T00:00:00Z',
          created_at: '2024-12-01T00:00:00Z',
          last_modified: '2024-12-20T00:00:00Z',
          template_name: 'Comprehensive Wellness Assessment',
          completion_percentage: 85,
        },
        {
          id: 'R002',
          client_id: '2',
          client_name: 'Michael Chen',
          type: 'weekly',
          status: 'sent',
          deadline: '2024-12-22T00:00:00Z',
          created_at: '2024-12-15T00:00:00Z',
          last_modified: '2024-12-21T00:00:00Z',
          template_name: 'Athletic Performance Review',
          completion_percentage: 100,
        },
      ];

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackReports),
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
