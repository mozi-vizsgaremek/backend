import { AccessToken, AccessTokenPayload, LoginSchema, RefreshToken, RefreshTokenPayload, RegisterSchema, TokenPayload, User, UserServiceResult } from "./types";
import { config } from '../../config';
import argon from 'argon2';
import { sign, verify } from 'jsonwebtoken';

import * as m from './model';
import { isString } from "../../utils";

import Result = UserServiceResult;

// TODO: replace with object?
type TokenPair = [RefreshToken, AccessToken];

export async function register(input: RegisterSchema): 
  Promise<[Result.ErrorUsernameTaken | Result.Ok, TokenPair | null]> {
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
  return [Result.Ok, await issueTokens(user!)];
}

export async function login(input: LoginSchema): 
  Promise<[Result.ErrorInvalidUsername | Result.ErrorInvalidPassword | Result.Ok
          , TokenPair | null]> {
  const user = await m.getUserByNick(input.username);
  if (user == null) 
    return [Result.ErrorInvalidUsername, null];

  if (!await argon.verify(user.password, input.password))
    return [Result.ErrorInvalidPassword, null];

  return [Result.Ok, await issueTokens(user)];
}

export async function issueTokens(user: User): Promise<TokenPair> {
  const refresh = await issueRefreshToken(user);
  const access = await issueAccessToken(refresh);

  return [refresh, access]; 
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

export async function issueAccessToken(refresh: RefreshToken): Promise<AccessToken> {
  const token = await validateRefreshToken(refresh);

  if (token === null)
    throw new Error('Invalid refresh token'); // TODO: replace with specific error class

  const user = await m.getUser(token.id);
  if (user === null)
    throw new Error('No user with the corresponding ID found'); // TODO: replace with specific error class

  console.log(user);

  return sign({
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