import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'

import { config } from './config'
import { fastify } from 'fastify'
import { join } from 'path'
import autoload from '@fastify/autoload'

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

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

  console.log('swagger register');
  server.register(swagger, {
    openapi: {
      info: {
        title: 'Mozi vizsgaremek',
        description: 'Karsza Levente, Klement Szabolcs, Papp Dávid',
        version: '0.0.1'
      },
      tags: [
        { name: 'auth', description: 'Authentication' },
        { name: 'test', description: 'Testing' },
        { name: 'totp', description: 'TOTP Second factor' }
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

  console.log('swagger ui register');
  server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });

  // set up database pool
  await decoratePool(server);

  // register utilities
  decorateUtils(server);

  // add authentication hook
  registerAuthHook(server);

  console.log('route register');
  console.log(`dirname: ${__dirname}`);
  // load routes
  server.register(autoload, {
    dir: join(__dirname, 'routes')
  });

  console.log(join(__dirname, 'routes'));
  console.log('before routes');
  server.printRoutes();
  console.log('after routes');

  server.listen({ port: config.port, host: '0.0.0.0' }, () => {
    console.log(`Server listening on ${config.port}`);
  });
}

init();
