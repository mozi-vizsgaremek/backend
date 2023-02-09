import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import { config } from './config'
import { fastify } from 'fastify'
import { join } from 'path'
import autoload from '@fastify/autoload'

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { createPool, DatabasePool } from 'slonik';

declare module 'fastify' {
  interface FastifyInstance {
    pool: DatabasePool
  }

  interface FastifyRequest {
    pool: DatabasePool
  }
}

async function init() {
  const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

  // :)
  // @ts-expect-error
  server.register(swagger, {
    swagger: {
      info: {
        title: 'Mozi vizsgaremek',
        description: 'Karsza Levente, Klement Szabolcs, Papp Dávid'
      }
    }
  });

  server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });

  // set up database pool
  const pool = await createPool(config.postgresConnectionString);

  server.decorate('pool', pool);
  server.decorateRequest('pool', pool);

  // load routes
  server.register(autoload, {
    dir: join(__dirname, 'routes')
  });

  server.listen({ port: config.port }, () => {
      console.log(`Server listening on ${config.port}`);
  });
}

init();