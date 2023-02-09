import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

declare module 'fastify' {
  interface FastifyReply {
    error: (statusCode: number, error: string, message: string) => FastifyReply
  }
}

function sendError(this: FastifyReply, statusCode: number, error: string, message: string): FastifyReply {
  return this.code(statusCode).send({
    statusCode, error, message
  })
}

export function decorateUtils(server: FastifyInstance) {
  server.addHook('onRequest', (_req: FastifyRequest, rep: FastifyReply, done: Function) => {
    rep.error = sendError.bind(rep);
    done();
  });
}
