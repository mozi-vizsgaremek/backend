import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default (server: FastifyInstance, _opts: null, done: Function) => {
    server.get('/', (_request: FastifyRequest, reply: FastifyReply) => {
        reply.code(418).send({ whoami: "teapot" });
    });

    done();
}
