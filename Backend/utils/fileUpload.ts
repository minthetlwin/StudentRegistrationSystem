import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Saves a base64 image string as a physical file (async).
 * @param base64String The full base64 data URI string (e.g. data:image/jpeg;base64,...)
 * @param prefix A prefix for the filename (e.g. 'profile' or 'live')
 * @returns The relative URL path to the saved file (e.g. '/uploads/profile-uuid.jpg')
 */
export const saveBase64Image = async (base64String: string, prefix: string): Promise<string | null> => {
  if (!base64String || !base64String.includes(';base64,')) {
    return null;
  }

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // Extract base64 data and extension
  const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }

  const extension = matches[1];
  const imageData = matches[2];
  const fileName = `${prefix}-${crypto.randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  // Write file asynchronously (non-blocking)
  await fs.writeFile(filePath, imageData, { encoding: 'base64' });

  return `/uploads/${fileName}`;
};
