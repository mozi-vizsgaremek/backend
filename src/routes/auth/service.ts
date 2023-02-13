import { AccessToken, AccessTokenPayload, LoginSchema, RefreshToken, RefreshTokenPayload, RegisterSchema, TokenPayload, User, UserServiceResult } from "./types";
import { config } from '../../config';
import argon from 'argon2';
import { sign, verify } from 'jsonwebtoken';
import { match, P } from 'ts-pattern';

import * as m from './model';
import { isString } from "../../utils";

import Result = UserServiceResult;

export type Tokens = {
  refresh: string,
  access: string
};

export async function register(input: RegisterSchema): Promise<[Result, Tokens | null]> {
  if (await m.userExistsByNick(input.username))
    return [Result.ErrorUsernameTaken, null];  

  // TODO: return new user so i don't have to fetch it manually
  await m.createUser({
    username: input.username,
    password: await argon.hash(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'customer'
  });

  const user = await m.getUserByNick(input.username);
  const tokens = await issueTokens(user!);

  return match(tokens)
    .with([Result.Ok, P.select()],
      (x) => [Result.Ok, x])
    .with([P.select(), P._],
      (err) => [err, null])
    .run() as [Result, Tokens | null];
}

export async function login(input: LoginSchema): Promise<[Result, Tokens | null]> {
  const user = await m.getUserByNick(input.username);
  if (user == null) 
    return [Result.ErrorInvalidUsername, null];

  if (!await argon.verify(user.password, input.password))
    return [Result.ErrorInvalidPassword, null];

  const tokens = await issueTokens(user!);

  return match(tokens)
    .with([Result.Ok, P.select()],
      (x) => [Result.Ok, x!])
    .with([P.select(), P._],
      (err) => [err, null])
    .run() as [Result, Tokens | null];
}

export async function issueTokens(user: User): Promise<[Result, Tokens | null]> {
  const refresh = await issueRefreshToken(user);
  const access = await issueAccessToken(refresh);

  return match(access)
    .with([Result.Ok, P.select()],
      (x) => [Result.Ok, { refresh, x }])
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
    role: user.role
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
      password: '',
      totpSecret: ''
    }
  } catch (_err) {
    return null;
  }
}