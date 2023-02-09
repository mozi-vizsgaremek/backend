import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { config } from './config';
import { createPool, DatabasePool } from "slonik";

// please not that this module assumes that decorate pool is called before the server starts up
// if it's not called, things might not go the way you want them to
export let pool: DatabasePool;

export async function decoratePool(server: FastifyInstance) {
  const localPool = await createPool(config.postgresConnectionString);
  pool = localPool;

  server.decorate('pool', pool);

  server.addHook('onRequest', (req: FastifyRequest, _res: FastifyReply, done: Function) => {
    req.pool = pool;

    done();
  });
}
