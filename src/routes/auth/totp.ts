import { generateSecret, generateUri, validateToken } from '@sunknudsen/totp';
import { config } from '../../config';
import type { TotpCode, TotpSecret } from '../../types';
import type { User } from './types';

export function generateTotpSecret(): TotpSecret {
  return generateSecret(32);
}

export function generateTotpUri(user: User, secret: TotpSecret): string {
  return generateUri('username ', user.username, secret, config.totpIssuer);
}

export function verifyTotpCode(token: TotpCode, secret: TotpSecret): boolean {
  return validateToken(secret, token);
}