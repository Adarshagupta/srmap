// This file is kept for future server-side Firebase functionality
// Currently using client-side Firebase only for static exports

export const isServerSide = false;

export function getServerSideAuth() {
  throw new Error('Server-side Firebase functionality is not available in static exports');
} 