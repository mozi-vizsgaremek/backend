import { generateSecret, generateUri, validateToken } from '@sunknudsen/totp';
import type { TotpCode, TotpSecret } from '../../types';
import type { User } from './types';

export function generateTotpSecret(): TotpSecret {
  return generateSecret(32);
}

export function generateTotpUri(user: User, secret: TotpSecret): string {
  return generateUri('Mozi', user.username, secret, 'Mozi Backend');
}

export function verifyTotpCode(token: TotpCode, secret: TotpSecret): boolean {
  return validateToken(secret, token);
}