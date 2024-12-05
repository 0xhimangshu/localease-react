import { networkInterfaces } from 'os';

export function getLocalIPs() {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  
  return results;
}

export function getAllowedOrigins() {
  const ips = getLocalIPs();
  const origins = [];
  
  // Add localhost variations
  origins.push(
    'http://localhost:5001',
    'http://127.0.0.1:5001',
    'https://tflkg4vs-5001.inc1.devtunnels.ms/'
  );
  
  // Add IP-based origins
  for (const ip of ips) {
    origins.push(`http://${ip}:5001`);
  }
  
  // Add environment-specific origins
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }
  
  // Add your development tunnel URL if needed
  origins.push('https://tflkg4vs-5001.inc1.devtunnels.ms');
  
  return origins.filter(Boolean);
} 