import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from './config';
import { createPool } from "slonik";

export async function decoratePool(server: FastifyInstance) {
  const pool = await createPool(config.postgresConnectionString);

  server.decorate('pool', pool);

  server.addHook('onRequest', (req: FastifyRequest, _res: FastifyReply, done: Function) => {
    req.pool = pool;

    done();
  });
}
