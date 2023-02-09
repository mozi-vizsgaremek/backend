import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import { config } from './config'
import { fastify } from 'fastify'
import { join } from 'path'
import autoload from '@fastify/autoload'

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import type { DatabasePool } from 'slonik';
import { decoratePool } from './pool'
import { decorateUtils } from './utils'

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
  await decoratePool(server);
  decorateUtils(server);

  // load routes
  server.register(autoload, {
    dir: join(__dirname, 'routes')
  });

  server.listen({ port: config.port }, () => {
    console.log(`Server listening on ${config.port}`);
  });
}

init();
