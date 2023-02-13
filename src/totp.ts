import { generateSecret, totp } from 'speakeasy';
import type { TotpCode, TotpSecret } from './routes/auth/types';

export function generateTotpSecret(): string {
  return generateSecret({
    length: 32
  }).base32;
}

export function verifyTotpCode(token: TotpCode, secret: TotpSecret): boolean {
  return totp.verify({
    secret, token,
    encoding: 'base32',
    window: 6
  });
}