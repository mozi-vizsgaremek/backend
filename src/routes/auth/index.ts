import type { FastifyInstance, FastifyReply } from "fastify";
import { match, P } from 'ts-pattern';

import type { FastifyRequestTypebox } from "../../types";
import { DisableTotpSchema, EnableTotpSchema, LoginSchema, RefreshSchema, RegisterSchema, UserServiceResult, VerifyTotpSchema } from "./types";
import { issueAccessToken } from "./jwt";
import { generateTotpUri } from "./totp";

import * as s from './service';

import Result = UserServiceResult; 

export default (server: FastifyInstance, _opts: null, done: Function) => {

  server.post('/register', {
    schema: RegisterSchema
  }, async (req: FastifyRequestTypebox<typeof RegisterSchema>, rep: FastifyReply) => {
    const res = await s.register(req.body);

    return match(res)
      .with([Result.ErrorUsernameTaken, P._], 
        () => rep.error(400, 'Username is already taken'))
      .with([P._, null],
        () => rep.error(500, 'Unknown error occurred'))
      .with([Result.Ok, P.select()], 
        (tokens) => rep.ok({
          refreshToken: tokens!.access,
          accessToken: tokens!.access
        }))
      .run();
  });

  server.post('/login', {
    schema: LoginSchema
  }, async (req: FastifyRequestTypebox<typeof LoginSchema>, rep: FastifyReply) => {
    const res = await s.login(req.body);

    return match(res)
      .with([P.union(Result.ErrorInvalidUsername, Result.ErrorInvalidPassword), P._],
        () => rep.error(401, 'Invalid username or password'))
      .with([Result.ErrorInvalidTotp, P._],
        () => rep.error(403, 'Invalid TOTP token'))
      .with([Result.ErrorTotpRequired, P._],
        () => rep.error(400, 'TOTP required'))
      .with([P._, null], 
        () => rep.error(500, 'Unknown internal error')) 
      .with([Result.Ok, P.select()],
        (tokens) => rep.ok({
          refreshToken: tokens!.refresh,
          accessToken: tokens!.access
        }))
      .run();
  });

  server.post('/refresh', {
    schema: RefreshSchema
  }, async (req: FastifyRequestTypebox<typeof RefreshSchema>, rep: FastifyReply) => {
    const res = await issueAccessToken(req.body.refreshToken);

    return match(res)
      .with([Result.ErrorInvalidRefreshToken, P._],
        () => rep.error(401, 'Invalid refresh token'))
      .with([Result.ErrorUserNotFound, P._],
        () => rep.error(404, 'User not found'))
      .with([Result.Ok, P.select()],
        (token) => rep.ok({
          accessToken: token!
        }))
      .run();
  });

  server.post('/totp', {
    schema: EnableTotpSchema
  }, async (req: FastifyRequestTypebox<typeof EnableTotpSchema>, rep: FastifyReply) => {
    const res = await s.enableTotp(req.user!); 

    return match(res)
      .with([Result.ErrorTotpAlreadyEnabled, P._],
        () => rep.error(403, 'TOTP already enabled'))
      .with([Result.Ok, P.select()],
        secret => rep.ok({ 
          secret,
          uri: generateTotpUri(req.user, secret!)
        }))
      .run();
  });

  server.put('/totp', {
    schema: VerifyTotpSchema
  }, async (req: FastifyRequestTypebox<typeof VerifyTotpSchema>, rep: FastifyReply) => {
    const res = await s.verifyTotp(req.user, req.body);
    
    return match(res)
      .with(Result.ErrorInvalidPassword,
        () => rep.error(401, 'Invalid password'))
      .with(Result.ErrorInvalidTotp,
        () => rep.error(403, 'Invalid TOTP token'))
      .with(Result.ErrorTotpSecretNotFound,
        () => rep.error(404, 'TOTP secret not found, onboarding process not started'))
      .with(Result.Ok,
        () => rep.ok())
      .run();
  });

  server.delete('/totp', {
    schema: DisableTotpSchema
  }, async (req: FastifyRequestTypebox<typeof DisableTotpSchema>, rep: FastifyReply) => {
    const res = await s.disableTotp(req.user, req.body);
   
    return match(res)
      .with(Result.ErrorInvalidPassword,
        () => rep.error(401, 'Invalid password'))
      .with(Result.ErrorInvalidTotp,
        () => rep.error(403, 'Invalid TOTP token'))
      .with(P.union(Result.ErrorTotpNotEnabled, Result.ErrorTotpSecretNotFound),
        () => rep.error(400, 'TOTP not enabled'))
      .with(Result.Ok, () => rep.ok())
      .run();
  });

  done();
}
