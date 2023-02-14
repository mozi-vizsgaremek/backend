import { LoginSchema, RegisterSchema, VerifyTotpSchema, 
         DisableTotpSchema, Tokens, UserServiceResult, 
         User, TotpSecret } from "./types";
import argon from 'argon2';
import { match, P } from 'ts-pattern';

import { issueTokens } from "./jwt";
import * as m from './model';

import Result = UserServiceResult;
import { generateTotpSecret, verifyTotpCode } from "./totp";

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

export async function enableTotp(user: User): Promise<[Result, TotpSecret | null]> {
  if (user.totpEnabled)
    return [Result.ErrorTotpAlreadyEnabled, null];

  const secret = generateTotpSecret();
  await m.setTotpSecret(user, secret);

  return [Result.Ok, secret];
}

export async function verifyTotp(user: User, input: VerifyTotpSchema): Promise<Result> {
  if (!await argon.verify(user.password, input.password))
    return Result.ErrorInvalidPassword;
  
  if (!user.totpSecret)
    return Result.ErrorTotpSecretNotFound;

  if (!verifyTotpCode(input.totp, user.totpSecret!))
    return Result.ErrorInvalidTotp;

  await m.setTotpStatus(user, true);

  return Result.Ok;
}

export async function disableTotp(user: User, input: DisableTotpSchema): Promise<Result> {
  // TODO: abstract duplicate code away
  if (!await argon.verify(user.password, input.password))
    return Result.ErrorInvalidPassword;
  
  if (!user.totpSecret) return Result.ErrorTotpSecretNotFound;
  if (!user.totpEnabled) return Result.ErrorTotpNotEnabled;

  if (!verifyTotpCode(input.totp, user.totpSecret!))
    return Result.ErrorInvalidTotp;

  await m.setTotpStatus(user, false);

  return Result.Ok;
}