import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validateAccessToken } from "./service";
import type { User } from "./types";

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }
}

export function registerAuthHook(server: FastifyInstance) {
  server.addHook('onRequest', async (req: FastifyRequest, rep: FastifyReply) => {
    if (!req.routeSchema.security) return;
    
    if (!req.headers.authorization)
      return rep.error(400, 'Missing header', 'Authorizaion header not found in request');

    if (!req.headers.authorization.match(/^bearer/i))
      return rep.error(400, 'Invalid header', 'Authorization header missing bearer prefix');

    const token = req.headers.authorization.replace(/^bearer\ /i, '');

    const user = await validateAccessToken(token);
    if (!user)
      return rep.error(401, 'Invalid token', 'Invalid access token'); 
      // TODO: return different code when token expires

    req.user = user;

    return;
  });
}