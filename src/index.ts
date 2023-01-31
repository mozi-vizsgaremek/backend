import { fastify, FastifyReply, FastifyRequest } from 'fastify';

const server = fastify();

server.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    console.log(request);
    reply.code(418).send({ whoami: "teapot" });
});

server.listen({ port: 8080 }, () => {
    console.log('server listening on 8080');
});
