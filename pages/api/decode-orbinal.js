import { createCanvas, loadImage } from 'canvas';
import { createWriteStream, unlink, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
const fs = require('fs');


const pipe = promisify(pipeline);

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error('Invalid color component');
  }
  return ((r << 16) | (g << 8) | b).toString(16);
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function upload(req, res) {
  console.log("Headers: ", req.headers);

  if (req.method === 'POST') {
    const { file } = req.body;
    const buffer = Buffer.from(file, 'base64');
    try {
     
      const loadedImage = await loadImage('./uploads/2.png');
      const width = 550;
      const height = 550;
      const canvas = createCanvas(width, height);
      const context = canvas.getContext('2d');

      context.drawImage(loadedImage, 0, 0, width, height);

      let combined = '';
      let converted = 2.18; // Initial value
      let endAngle = 0;

      for (let i = 0; i < 11; i++) {
        const x = width / 2;
        const y = height / 2;
        const radius = Math.round((width / 2.5) - (i * 18));
        const startAngle = endAngle;
        endAngle = startAngle + Math.round((converted / (i + 1)) * Math.PI);

        if (endAngle <= startAngle) {
          endAngle = Math.round(startAngle - 10);
        }

        const midx = Math.round(x + Math.cos(endAngle) * (radius + 10));
        const midy = Math.round(y + Math.sin(endAngle) * (radius + 10));

        const pixel = context.getImageData(midx, midy, 1, 1).data;
        let hex = ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);

        combined += hex;

        if (isNaN(hex.substring(5))) {
          converted = hex.substring(5).charCodeAt(0) - 96;
        } else {
          converted = parseInt(hex.substring(5), 10);
        }
      }

      const decodedTxid = combined.slice(9);
      res.status(200).json({ message: 'File uploaded and decoded successfully', decodedTxid });
    } catch (error) {
      console.error('Upload or decoding failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
