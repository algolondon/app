import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

// Mock fetch to prevent console errors overlay in Next.js when Sanity isn't configured
const originalFetch = client.fetch.bind(client);
client.fetch = async (query: string, params?: any, options?: any) => {
  if (projectId === 'placeholder-project-id') {
    return null;
  }
  return originalFetch(query, params, options);
};
