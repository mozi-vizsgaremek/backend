import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import { config } from './config'
import { fastify } from 'fastify'
import { join } from 'path'
import autoload from '@fastify/autoload'

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

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

server.register(autoload, {
  dir: join(__dirname, 'routes')
});

server.listen({ port: config.port }, () => {
    console.log(`Server listening on ${config.port}`);
});
