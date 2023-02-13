import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { bearerSecurity } from '../types';

export default (server: FastifyInstance, _opts: null, done: Function) => {
  server.get('/', {
    schema: {
      summary: 'Test endpoint',
      tags: [ 'test' ],
      security: [ bearerSecurity ]
    }
  }, (_request: FastifyRequest, reply: FastifyReply) => {
    reply.code(418).send({ whoami: "teapot" });
  });

  done();
}
