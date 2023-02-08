import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from '@sinclair/typebox'


export default (server: FastifyInstance, _opts: null, done: Function) => {
    server.post('/register', {
        schema: {
            body: Type.Object({
                username: Type.String(),
                firstName: Type.String(),
                lastName: Type.String(), 
                password: Type.String()
            })
        }
    }, (_request: FastifyRequest, reply: FastifyReply) => {
        reply.code(418).send({ whoami: "teapot" });
    });

    done();
}
