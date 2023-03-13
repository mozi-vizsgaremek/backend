import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { requireRole, UUID } from "../../types";

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  server.get('/', {
    schema: {
      summary: 'List all auditoriums. Requires admin role',
      tags: [ 'auditorium' ],
      security: requireRole('admin'),
      response: {
        200: Type.Array(t.AuditoriumSchema)
      }
    } 
  }, async (_req, rep) => {
    const res = await s.getAuditoriums();

    return rep.ok(res);
  });

  server.get('/:id', {
    schema: {
      summary: 'Get single auditorium. Requires admin role',
      tags: [ 'auditorium' ],
      security: requireRole('admin'),
      params: Type.Object({
        id: UUID
      }),
      response: {
        200: t.AuditoriumSchema
      } 
    }
  }, async (req, rep) => {
    const res = await m.getAuditorium(req.params.id);

    if (!res)
      return rep.error(404, 'Auditorium not found');

    return rep.ok(res);
  });

  server.post('/', {
    schema: {
      summary: 'Create a new auditorium. Requires admin role',
      tags: [ 'auditorium' ],
      security: requireRole('admin'),
      body: Type.Omit(t.AuditoriumSchema, ['id']),
      response: {
        200: t.AuditoriumSchema
      }
    }
  }, async (req, rep) => {
    const res = await m.createAuditorium(req.body.name, req.body.seats);

    return rep.ok(res);
  });

  server.delete('/:id', {
    schema: {
      summary: 'Delete an auditorium. Requires admin role',
      description: 'Fails silently if auditorium with the given ID was not found',
      tags: [ 'auditorium' ],
      security: requireRole('admin'),
      params: Type.Object({
        id: UUID
      })
    }
  }, async (req, rep) => {
    await m.deleteAuditorium(req.params.id);
    
    return rep.ok();
  });
}

export default plugin;