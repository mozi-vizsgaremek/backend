import { sign, verify } from 'jsonwebtoken';
import { match, P } from 'ts-pattern';

import { AccessTokenPayload, RefreshTokenPayload, TokenPayload, Tokens, User, UserServiceResult } from "./types";
import { config } from '../../config';
import { isString } from "../../utils";
import * as m from './model';

import Result = UserServiceResult;
import type { AccessToken, RefreshToken } from '../../types';

export async function issueTokens(user: User): Promise<[Result, Tokens | null]> {
  const refresh = await issueRefreshToken(user);
  const access = await issueAccessToken(refresh);

  return match(access)
    .with([Result.Ok, P.select()],
      (x) => [Result.Ok, { refresh, access: x }])
    .with([P.select(), P._],
      (err) => [err, null])
    .run() as [Result, Tokens | null];
}

export async function issueRefreshToken(user: User): Promise<RefreshToken> {
  return sign({
    id: user.id,
    type: 'refresh'
  }, config.jwtSecret, {
    issuer: config.jwtIssuer,
    expiresIn: config.refreshTokenExpiration
  });
}

export async function validateRefreshToken(refresh: RefreshToken): Promise<RefreshTokenPayload|null> {
  try {
    const payload = verify(refresh, config.jwtSecret, {
      issuer: config.jwtIssuer
    });

    const token = (isString(payload) ? JSON.parse(payload) : payload) as TokenPayload;
    return token.type === 'refresh' ? token as RefreshTokenPayload : null;
  } catch (_err) {
    return null;
  }
}

export async function issueAccessToken(refresh: RefreshToken): Promise<[Result, AccessToken | null]> {
  const token = await validateRefreshToken(refresh);

  if (token === null)
    return [Result.ErrorInvalidRefreshToken, null];  

  const user = await m.getUser(token.id);
  if (user === null)
    return [Result.ErrorUserNotFound, null];

  const access = sign({
    id: user.id,
    type: 'access',
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    totpEnabled: user.totpEnabled ?? false
  }, config.jwtSecret, {
    issuer: config.jwtIssuer,
    expiresIn: config.accessTokenExpiration
  });

  return [Result.Ok, access];
}

export async function validateAccessToken(access: AccessToken): Promise<User|null> {
  try {
    const payload = verify(access, config.jwtSecret, {
      issuer: config.jwtIssuer
    });

    const decoded = (isString(payload) ? JSON.parse(payload) : payload) as TokenPayload;
    if (decoded.type != 'access')
      return null;

    const accessPayload = decoded as AccessTokenPayload;

    return {
      id: accessPayload.id,
      username: accessPayload.username,
      firstName: accessPayload.firstName,
      lastName: accessPayload.lastName,
      role: accessPayload.role,
      totpEnabled: accessPayload.totpEnabled,
      password: ''
    }
  } catch (_err) {
    return null;
  }
}