import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const store = getStore('iwil-assets');

    if (event.httpMethod === 'POST') {
      // Upload the IWIL logo
      const logoSvg = `
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer circle with gradient border -->
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#A8E6CF;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#7FDBDA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#88D8C0;stop-opacity:1" />
            </linearGradient>
            
            <!-- Lotus petal gradients -->
            <linearGradient id="petalGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#5DADE2;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#3498DB;stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="petalGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#A8E6CF;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#7FDBDA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#5DADE2;stop-opacity:1" />
            </linearGradient>
            
            <!-- Human figure gradient -->
            <linearGradient id="humanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F7DC6F;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#F4D03F;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F1C40F;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Outer circle border -->
          <circle cx="100" cy="100" r="95" fill="none" stroke="url(#borderGradient)" stroke-width="4"/>
          
          <!-- Background circle -->
          <circle cx="100" cy="100" r="90" fill="#FEFEFE"/>
          
          <!-- Lotus petals -->
          <!-- Top center petal -->
          <path d="M100 40 C85 25, 115 25, 100 40 C100 55, 90 70, 100 80 C110 70, 100 55, 100 40 Z" fill="url(#petalGradient1)"/>
          
          <!-- Left petal -->
          <path d="M60 80 C45 65, 45 95, 60 80 C75 80, 90 90, 95 100 C90 110, 75 100, 60 80 Z" fill="url(#petalGradient2)"/>
          
          <!-- Right petal -->
          <path d="M140 80 C155 65, 155 95, 140 80 C125 80, 110 90, 105 100 C110 110, 125 100, 140 80 Z" fill="url(#petalGradient2)"/>
          
          <!-- Bottom left petal -->
          <path d="M75 125 C60 110, 60 140, 75 125 C90 125, 95 135, 95 145 C85 155, 80 140, 75 125 Z" fill="url(#petalGradient1)"/>
          
          <!-- Bottom right petal -->
          <path d="M125 125 C140 110, 140 140, 125 125 C110 125, 105 135, 105 145 C115 155, 120 140, 125 125 Z" fill="url(#petalGradient1)"/>
          
          <!-- Human figure in meditation pose -->
          <!-- Head -->
          <circle cx="100" cy="90" r="8" fill="white"/>
          
          <!-- Body -->
          <path d="M100 98 L100 125" stroke="white" stroke-width="4" stroke-linecap="round"/>
          
          <!-- Arms in raised position -->
          <path d="M100 105 C90 95, 85 100, 88 110" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <path d="M100 105 C110 95, 115 100, 112 110" stroke="white" stroke-width="3" stroke-linecap="round"/>
          
          <!-- Legs in lotus position -->
          <path d="M100 125 C95 130, 85 128, 82 135" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <path d="M100 125 C105 130, 115 128, 118 135" stroke="white" stroke-width="3" stroke-linecap="round"/>
          
          <!-- Inner glow for human figure -->
          <circle cx="100" cy="110" r="20" fill="url(#humanGradient)" opacity="0.3"/>
          
          <!-- I.W.I.L. text -->
          <text x="100" y="175" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#3498DB">
            I.W.I.L.
          </text>
        </svg>
      `;

      // Store the logo in Netlify Blobs
      await store.set('iwil-logo.svg', logoSvg, {
        metadata: {
          contentType: 'image/svg+xml',
          uploadedAt: new Date().toISOString(),
          description: 'IWIL Protocol official logo - lotus with meditation figure'
        }
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'IWIL logo uploaded successfully',
          logoUrl: '/.netlify/blobs/iwil-assets/iwil-logo.svg',
          key: 'iwil-logo.svg'
        }),
      };

    } else if (event.httpMethod === 'GET') {
      // Retrieve the logo
      const logo = await store.get('iwil-logo.svg');
      
      if (!logo) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Logo not found' }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
        body: logo,
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('Logo upload/retrieval error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Failed to handle logo request',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
