import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getReasonPhrase } from 'http-status-codes';

declare module 'fastify' {
  interface FastifyReply {
    error: (statusCode: number, message: string) => FastifyReply
    ok: (body?: unknown) => FastifyReply
  }
}

function sendError(this: FastifyReply, statusCode: number, message: string): FastifyReply {
  return this.code(statusCode).send({
    statusCode, 
    error: getReasonPhrase(statusCode), 
    message
  })
}

function sendSuccess(this: FastifyReply, body?: unknown): FastifyReply {
  return this.code(200).send(body);
}

export function decorateUtils(server: FastifyInstance) {
  server.addHook('onRequest', (_req: FastifyRequest, rep: FastifyReply, done: Function) => {
    rep.error = sendError.bind(rep);
    rep.ok = sendSuccess.bind(rep);
    done();
  });
}

export function isString(data: any): data is string {
  return typeof data === 'string';
}

export function unwrapCount(count: { count: number } | null): number|null {
  return count == null ? null : count.count;
}

export function wrapListGetter<T>(fn: () => Promise<readonly T[]>): () => Promise<readonly T[]> {
  return async () => {
    let res: readonly T[];

    try {
      res = await fn();
    } catch {
      return [];
    }

    return res;
  }
}