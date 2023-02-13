import { LoginSchema, RegisterSchema, Tokens, UserServiceResult } from "./types";
import argon from 'argon2';
import { match, P } from 'ts-pattern';

import { issueTokens } from "./jwt";
import * as m from './model';

import Result = UserServiceResult;

export async function register(input: RegisterSchema): Promise<[Result, Tokens | null]> {
  if (await m.userExistsByNick(input.username))
    return [Result.ErrorUsernameTaken, null];  

  // TODO: return new user so i don't have to fetch it manually
  await m.createUser({
    username: input.username,
    password: await argon.hash(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'customer',
    totpEnabled: false
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

