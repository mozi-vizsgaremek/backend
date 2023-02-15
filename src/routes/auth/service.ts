import { LoginSchema, RegisterSchema, VerifyTotpSchema, 
         DisableTotpSchema, Tokens, UserServiceResult, 
         User, TotpSecret, ChangePasswordSchema, DeleteSchema } from "./types";
import { hash, verify } from 'argon2';
import { match, P } from 'ts-pattern';

import { generateTotpSecret, verifyTotpCode } from "./totp";
import { issueTokens } from "./jwt";
import * as m from './model';

import Result = UserServiceResult;

export async function register(input: RegisterSchema): Promise<[Result, Tokens | null]> {
  if (await m.userExistsByNick(input.username))
    return [Result.ErrorUsernameTaken, null];  

  // TODO: return new user so i don't have to fetch it manually
  await m.createUser({
    username: input.username,
    password: await hash(input.password),
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

  if (!await verify(user.password, input.password))
    return [Result.ErrorInvalidPassword, null];

  if (user.totpEnabled) {
    if (!input.totp)
      return [Result.ErrorTotpRequired, null];

    if(!verifyTotpCode(input.totp, user.totpSecret!))
      return [Result.ErrorInvalidTotp, null];
  }

  const tokens = await issueTokens(user!);

  return match(tokens)
    .with([Result.Ok, P.select()],
      (x) => [Result.Ok, x!])
    .with([P.select(), P._],
      (err) => [err, null])
    .run() as [Result, Tokens | null];
}

export async function changePassword(user: User, input: ChangePasswordSchema): Promise<Result> {
  const dbUser = (await m.getUser(user.id!))!;

  if (!verify(dbUser.password, input.oldPassword))
    return Result.ErrorInvalidPassword;

  const newHash = await hash(input.newPassword);
  await m.setPassword(user, newHash);

  return Result.Ok;
}

export async function enableTotp(user: User): Promise<[Result, TotpSecret | null]> {
  if (user.totpEnabled)
    return [Result.ErrorTotpAlreadyEnabled, null];

  const secret = generateTotpSecret();
  await m.setTotpSecret(user, secret);

  return [Result.Ok, secret];
}

export async function verifyTotp(user: User, input: VerifyTotpSchema): Promise<Result> {
  // fetch user since the auth hook doesn't populate the password field
  const dbUser = (await m.getUser(user.id!))!;
  
  if (!await verify(dbUser.password, input.password))
    return Result.ErrorInvalidPassword;
  
  if (!dbUser.totpSecret)
    return Result.ErrorTotpSecretNotFound;

  if (!verifyTotpCode(input.totp, dbUser.totpSecret!))
    return Result.ErrorInvalidTotp;

  await m.setTotpStatus(user, true);

  return Result.Ok;
}

export async function disableTotp(user: User, input: DisableTotpSchema): Promise<Result> {
  // fetch user since the auth hook doesn't populate the password field
  const dbUser = (await m.getUser(user.id!))!;
  
  // TODO: abstract duplicate code away
  if (!await verify(dbUser.password, input.password))
    return Result.ErrorInvalidPassword;
  
  if (!dbUser.totpSecret) return Result.ErrorTotpSecretNotFound;
  if (!dbUser.totpEnabled) return Result.ErrorTotpNotEnabled;

  if (!verifyTotpCode(input.totp, dbUser.totpSecret!))
    return Result.ErrorInvalidTotp;

  await m.setTotpStatus(user, false);

  return Result.Ok;
}

export async function deleteUser(user: User, input: DeleteSchema): Promise<Result> {
  const dbUser = (await m.getUser(user.id!))!;

  if (!await verify(dbUser.password, input.password))
    return Result.ErrorInvalidPassword;

  if (dbUser.totpEnabled) {
    if (!input.totp)
      return Result.ErrorTotpRequired;

    if (!verifyTotpCode(input.totp, dbUser.totpSecret!))
      return Result.ErrorInvalidTotp;
  }

  await m.deleteUser(user);

  return Result.Ok;
}