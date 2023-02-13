import type { FastifyInstance, FastifyReply } from "fastify";
import { match, P } from 'ts-pattern';

import type { FastifyRequestTypebox } from "../../types";
import { LoginSchema, RefreshSchema, RegisterSchema, UserServiceResult } from "./types";
import * as s from './service';

import Result = UserServiceResult; 

export default (server: FastifyInstance, _opts: null, done: Function) => {

  server.post('/register', {
    schema: RegisterSchema
  }, async (req: FastifyRequestTypebox<typeof RegisterSchema>, rep: FastifyReply) => {

    const res = await s.register(req.body);

    return match(res)
      .with([Result.ErrorUsernameTaken, P._], 
        () => rep.error(400, 'Username taken', 'Username is already taken.'))
      .with([P._, null],
        () => rep.error(500, 'Internal server error', 'Unknown error occurred'))
      .with([Result.Ok, P.select()], 
        (tokens) => rep.code(200).send({
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
        () => rep.error(401, 'Invalid credentials', 'Invalid username or password'))
      .with([P._, null], 
        () => rep.error(500, 'Internal server error', 'Unknown internal error')) 
      .with([Result.Ok, P.select()],
        (tokens) => rep.code(200).send({
          refreshToken: tokens!.refresh,
          accessToken: tokens!.access
        }))
      .run();
  });

  server.post('/refresh', {
    schema: RefreshSchema
  }, async (req: FastifyRequestTypebox<typeof RefreshSchema>, rep: FastifyReply) => {


  });

  done();
}
