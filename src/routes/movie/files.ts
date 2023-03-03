import { pipeline } from 'node:stream/promises';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { config } from '../../config';
import { access, constants, mkdir, rm } from 'node:fs/promises';

function decodeBase64Payload(payload: string): [string, Buffer] {
  const buf = Buffer.from(payload, 'base64');
  const hash = createHash('sha256').update(buf).digest('base64');

  return [hash, buf];
}

export async function createUploadDirectory() {
  access(config.uploadDirectory, constants.X_OK)
    .catch(async () => {  
      await mkdir(config.uploadDirectory)
    });
}

export async function saveImage(payload: string): Promise<string> { // returns file hash
  const [hash, buf] = decodeBase64Payload(payload);   
  const path = join(config.uploadDirectory, hash);

  await pipeline(buf, createWriteStream(path));

  return hash;
}

export async function deleteFile(hash: string) {
  await rm(join(config.uploadDirectory, hash));
}