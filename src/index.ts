import { fastify, FastifyReply, FastifyRequest } from 'fastify';
import { config } from './config';

const server = fastify();

server.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    console.log(request);
    reply.code(418).send({ whoami: "teapot" });
});

server.listen({ port: config.port }, () => {
    console.log('server listening on 8080');
});
