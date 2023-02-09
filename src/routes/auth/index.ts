import type { FastifyInstance, FastifyReply } from "fastify";
import type { FastifyRequestTypebox } from "../../types";

import { RegisterUserSchema } from "./types";
import * as m from './model';

export default (server: FastifyInstance, _opts: null, done: Function) => {

  server.post('/register', {
    schema: RegisterUserSchema
  }, async (req: FastifyRequestTypebox<typeof RegisterUserSchema>, reply: FastifyReply) => {

    if (await m.userExists(req.body.username))
      return reply.error(400, 'Duplicate username', 'Another user is already using this username.');

    return reply.code(418).send({ whoami: "teapot" });
  });

  done();
}
