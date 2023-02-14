import { generateSecret, totp } from 'speakeasy';
import type { TotpCode, TotpSecret, User } from './types';

export function generateTotpSecret(): TotpSecret {
  return generateSecret({
    length: 32
  }).base32;
}

export function generateTotpUri(user: User, secret: TotpSecret): string {
  return `otpauth://totp/Mozi:${user.username}?secret=${secret}&issuer=MoziBackend`;
}

export function verifyTotpCode(token: TotpCode, secret: TotpSecret): boolean {
  return totp.verify({
    secret, token,
    encoding: 'base32',
    window: 6
  });
}