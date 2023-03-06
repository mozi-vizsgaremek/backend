import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { config } from '../../config';
import { access, constants, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

function decodeBase64Payload(payload: string): [string, Buffer] {
  const buf = Buffer.from(payload, 'base64');
  const hash = createHash('sha256').update(buf).digest('hex');

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

  // TODO: check mime type, only allow images to be uploaded

  await writeFile(path, new Uint8Array(buf));

  return hash;
}

export async function deleteImage(hash: string) {
  const path = join(config.uploadDirectory, hash);

  if (!existsSync(path)) return;

  await rm(join(config.uploadDirectory, hash));
}