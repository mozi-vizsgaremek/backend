import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'

import { config } from './config'
import { fastify } from 'fastify'
import { join } from 'path'

import autoload from '@fastify/autoload'
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';

import type { DatabasePool } from 'slonik';
import { decoratePool } from './pool'
import { decorateUtils } from './utils'
import { registerAuthHook } from './routes/auth/hook'

declare module 'fastify' {
  interface FastifyInstance {
    pool: DatabasePool
  }

  interface FastifyRequest {
    pool: DatabasePool
  }
}

async function init() {
  const server = fastify()
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler);

  server.register(cors, {
    origin: config.env == 'dev' ? /^.*/ : /.*leventea\.hu.*/
  });

  if (config.env == 'dev') {

    server.register(swagger, {
      openapi: {
        info: {
          title: 'Mozi vizsgaremek',
          description: 'Karsza Levente, Klement Szabolcs, Papp Dávid',
          version: '0.0.1'
        },
        tags: [
          { name: 'admin', description: 'Administrative endpoints' },
          { name: 'auth', description: 'Authentication' },
          { name: 'totp', description: 'TOTP Second factor' },
          { name: 'shift', description: 'Work shift management' },
          { name: 'booking', description: 'Shift booking management' },
          { name: 'movie', description: 'Movies available for scheduling' },
          { name: 'test', description: 'Testing' }
        ],
        components: {
          securitySchemes: {
            bearer: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      }
    });

    server.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        deepLinking: false
      }
    });

  }

  // set up database pool
  await decoratePool(server);

  // register utilities
  decorateUtils(server);

  // add authentication hook
  registerAuthHook(server);

  // load routes
  server.register(autoload, {
    dir: join(__dirname, 'routes')
  });

  server.listen({ port: config.port, host: '0.0.0.0' }, () => {
    console.log(`Server listening on ${config.port}`);
  });
}

init();
