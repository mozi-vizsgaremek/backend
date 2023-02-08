import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import { config } from './config'
import { fastify } from 'fastify'
import { join } from 'path'
import autoload from '@fastify/autoload'

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.register(autoload, {
  dir: join(__dirname, 'routes')
});

server.listen({ port: config.port }, () => {
    console.log(`Server listening on ${config.port}`);
});
