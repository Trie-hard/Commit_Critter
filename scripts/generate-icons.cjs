const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create PNG buffer without external dependencies
function createPng(size, bgHex, fgHex) {
  const width = size;
  const height = size;

  // Helper to parse hex
  function parseColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  }

  const bg = parseColor(bgHex);
  const fg = parseColor(fgHex);

  // Raw RGBA bitmap with filter byte 0 at each scanline
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (rowBytes + 1));

  const radius = size * 0.45;
  const centerX = size / 2;
  const centerY = size / 2;

  // Paw pad definitions (relative to center)
  const mainPadRadius = size * 0.18;
  const toeRadius = size * 0.08;
  const toes = [
    { x: -size * 0.18, y: -size * 0.16 },
    { x: -size * 0.07, y: -size * 0.24 },
    { x:  size * 0.07, y: -size * 0.24 },
    { x:  size * 0.18, y: -size * 0.16 },
  ];

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      if (distFromCenter <= radius) {
        // Inside outer circle
        let isPaw = false;
        
        // Main pad
        const mainPadDist = Math.sqrt(dx * dx + Math.pow(dy - size * 0.06, 2));
        if (mainPadDist <= mainPadRadius) {
          isPaw = true;
        }

        // Toes
        for (const toe of toes) {
          const toeDist = Math.sqrt(Math.pow(dx - toe.x, 2) + Math.pow(dy - toe.y, 2));
          if (toeDist <= toeRadius) {
            isPaw = true;
            break;
          }
        }

        const color = isPaw ? fg : bg;
        rawData[offset++] = color[0];
        rawData[offset++] = color[1];
        rawData[offset++] = color[2];
        rawData[offset++] = color[3];
      } else {
        // Transparent
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
      }
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // CRC32 table
  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);

    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(body), 0);

    return Buffer.concat([len, body, crcVal]);
  }

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA color
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve(__dirname, '../public/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

[16, 48, 128].forEach((size) => {
  const buf = createPng(size, '#17191c', '#fbe1d1');
  const filePath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, buf);
  console.log(`Created ${filePath} (${size}x${size})`);
});
