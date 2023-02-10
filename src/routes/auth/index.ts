import type { FastifyInstance, FastifyReply } from "fastify";
import { match } from 'ts-pattern';

import type { FastifyRequestTypebox } from "../../types";
import { RegisterUserSchema, UserServiceResult } from "./types";
import * as s from './service';

export default (server: FastifyInstance, _opts: null, done: Function) => {

  server.post('/register', {
    schema: RegisterUserSchema
  }, async (req: FastifyRequestTypebox<typeof RegisterUserSchema>, rep: FastifyReply) => {

    const res = await s.createUser(req.body);

    return match(res)
      .with(UserServiceResult.ErrorUsernameTaken, 
        () => rep.error(400, 'Username taken', 'Username is already taken.'))
      .with(UserServiceResult.Ok, 
        () => rep.code(200).send())
      .run();
  });

  done();
}
