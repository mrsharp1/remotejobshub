const fs = require('fs');
const path = 'C:/Users/Friday Chimobi/Documents/websites/REMOTE JOBS HUB 2/public/notification.wav';
const sampleRate = 44100;
const duration = 0.45;
const numSamples = Math.floor(sampleRate * duration);
const buffer = Buffer.alloc(44 + numSamples * 2);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

const freq = 600;
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  let amp = 1.0;
  if (t < 0.05) amp = t / 0.05;
  else if (t > 0.25) amp = Math.max(0, 1.0 - (t - 0.25) / 0.2);
  
  const val = Math.sin(2 * Math.PI * freq * t) * 8000 * amp;
  buffer.writeInt16LE(Math.floor(val), 44 + i * 2);
}

fs.writeFileSync(path, buffer);
console.log('Done! Created length: ' + fs.statSync(path).size);
