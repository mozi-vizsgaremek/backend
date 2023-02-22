import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserRoleLevel } from "../../types";
import { validateAccessToken } from "./jwt";
import type { User } from "./types";

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }
}

export function registerAuthHook(server: FastifyInstance) {
  server.addHook('onRequest', async (req: FastifyRequest, rep: FastifyReply) => {
    if (!req.routeSchema.security) return;

    // actual warcrime btw
    // i couldnt extend the schema type with another field
    // so i have to do this garbage
    const bearerAccessObj = req.routeSchema.security.filter(x => !!x['bearer'])[0] ?? { 'bearer': ['admin'] };
    let bearerAccess = bearerAccessObj['bearer']!;
    
    // there should only be a single element in that array
    if (bearerAccess.length > 1 || bearerAccess.length <= 0)
      bearerAccess = ['admin']
    
    // this is not typesafe whatsoever
    // incredibly fragile, but it is what it is :D
    const minAccess = UserRoleLevel[bearerAccess[0] ?? 'admin'] ?? UserRoleLevel['admin'];

    if (!req.headers.authorization)
      return rep.error(400, 'Authorizaion header not found in request');

    if (!req.headers.authorization.match(/^bearer/i))
      return rep.error(400, 'Authorization header missing bearer prefix');

    const token = req.headers.authorization.replace(/^bearer\ /i, '');

    const user = await validateAccessToken(token);
    if (!user)
      return rep.error(401, 'Invalid access token'); 
      // TODO: return different code when token expires

    const currentAccess = UserRoleLevel[user.role] ?? UserRoleLevel['customer'];

    if (currentAccess! < minAccess!)
      return rep.error(403, 'Insufficient access role');

    req.user = user;

    return;
  });
}
