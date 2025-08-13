import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from '@netlify/blobs';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Extract the key from the path, e.g., /api/avatars/some-key -> some-key
  const key = event.path.split('/').pop();

  if (!key) {
    return { statusCode: 400, body: "Avatar key is missing." };
  }

  const store = getStore('avatars');
  const blob = await store.get(key, { type: 'blob' });

  if (!blob) {
    return { statusCode: 404, body: "Avatar not found." };
  }
  
  const headers = {
    'Content-Type': blob.type,
    'Content-Length': blob.size.toString(),
    'Cache-Control': 'public, max-age=31536000, immutable' // Cache for 1 year
  };

  return {
    statusCode: 200,
    headers,
    body: (await blob.arrayBuffer()).toString('base64'),
    isBase64Encoded: true,
  };
};

export { handler };
