import type { FastifyInstance, FastifyReply } from "fastify";
import type { FastifyRequestTypebox } from "../../types";

import { RegisterUserSchema } from "./types";
import * as m from './model';
import * as s from './service';

export default (server: FastifyInstance, _opts: null, done: Function) => {

  server.post('/register', {
    schema: RegisterUserSchema
  }, async (req: FastifyRequestTypebox<typeof RegisterUserSchema>, reply: FastifyReply) => {

    if (await m.userExists(req.body.username))
      return reply.error(400, 'Duplicate username', 'Another user is already using this username.');

    await s.createUser(req.body);

    return reply.code(200).send();
  });

  done();
}
