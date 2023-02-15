import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { bearerSecurity, requireRole } from '../types';

export default (server: FastifyInstance, _opts: null, done: Function) => {
  server.get('/', {
    schema: {
      summary: 'Test endpoint',
      tags: [ 'test' ],
      security: requireRole('customer')
    }
  }, (_request: FastifyRequest, reply: FastifyReply) => {
    reply.code(418).send({ whoami: "teapot" });
  });

  done();
}
