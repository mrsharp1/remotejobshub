const fs = require('fs');
const path = require('path');

const tables = new Set();
const rpcs = new Set();
const storages = new Set();
const channels = new Set();
const typesFile = 'src/types/index.ts';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      
      const fromMatches = content.matchAll(/\.from\(['"`]([^'"`]+)['"`]\)/g);
      for (const m of fromMatches) tables.add(m[1]);
      
      const rpcMatches = content.matchAll(/\.rpc\(['"`]([^'"`]+)['"`]\)/g);
      for (const m of rpcMatches) rpcs.add(m[1]);

      const storageMatches = content.matchAll(/\.storage\.from\(['"`]([^'"`]+)['"`]\)/g);
      for (const m of storageMatches) storages.add(m[1]);

      const channelMatches = content.matchAll(/\.channel\(['"`]([^'"`]+)['"`]\)/g);
      for (const m of channelMatches) channels.add(m[1]);
    }
  }
}

walk('src');

console.log('--- TABLES ---');
console.log(Array.from(tables).sort().join('\n'));
console.log('\n--- RPCS ---');
console.log(Array.from(rpcs).sort().join('\n'));
console.log('\n--- STORAGE BUCKETS ---');
console.log(Array.from(storages).sort().join('\n'));
console.log('\n--- CHANNELS ---');
console.log(Array.from(channels).sort().join('\n'));
