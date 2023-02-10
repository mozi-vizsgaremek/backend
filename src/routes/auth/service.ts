import { AccessToken, RefreshToken, RefreshTokenPayload, RegisterUserSchema, User, UserServiceResult } from "./types";
import { config } from '../../config';
import { hash } from 'argon2';
import { sign, verify } from 'jsonwebtoken';

import * as m from './model';
import { isString } from "../../utils";

export async function createUser(input: RegisterUserSchema): Promise<UserServiceResult> {
  if (await m.userExistsByNick(input.username))
    return UserServiceResult.ErrorUsernameTaken;  

  await m.createUser({
    username: input.username,
    password: await hash(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'customer'
  });

  return UserServiceResult.Ok;
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

    const token = (isString(payload) ? JSON.parse(payload) : payload) as RefreshTokenPayload;
    return token.type === 'refresh' ? token : null;
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

  return sign({
    id: user.id,
    username: user.username,
    role: user.role
  }, config.jwtSecret, {
    issuer: config.jwtIssuer,
    expiresIn: config.accessTokenExpiration
  });
}

// export async function validateAccessToken(access: AccessToken): Promise<boolean> {
// }