import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // fallback
}


function updateEnv() {
  const ip      = getLocalIpAddress();
  const envPath = path.join(__dirname, '..', '.env');

  // read existing .env (if any)
  const existingLines = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, 'utf8').split('\n').filter(Boolean)
    : [];

  const map = Object.fromEntries(
    existingLines.map((ln) => {
      const [k, ...rest] = ln.split('=');
      return [k.trim(), rest.join('=').trim()];
    })
  );

  // update only this key
  map.EXPO_PUBLIC_API_URL = `http://${ip}:5080`;

  const newContent = Object.entries(map)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';

  fs.writeFileSync(envPath, newContent);
  console.log('✅ .env updated:\n' + newContent);
}

updateEnv();