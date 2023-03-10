import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { requireRole, UUID } from "../../types";

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  server.get('/', {
    schema: {
      summary: 'List all screenings',
      tags: [ 'screening' ],
      response: {
        200: Type.Array(t.ScreeningSchema)
      }
    }
  }, async (_req, rep) => {
    const res = await s.getScreenings();

    rep.ok(res);
  });

  server.get('/:id', {
    schema: {
      summary: 'Get specific screening',
      tags: [ 'screening' ],
      params: Type.Object({
        id: UUID
      }),
      response: {
        200: Type.Array(t.ScreeningSchema)
      }
    }
  }, async (req, rep) => {
    const res = await m.getScreening(req.params.id);

    if (!res) {
      return rep.error(404, 'Screening not found');
    }

    return rep.ok(res);
  });

  server.post('/', {
    schema: {
      summary: 'Create new screening, requires manager role.',
      security: requireRole('manager'),
      body: Type.Pick(t.ScreeningSchema, ['movieId', 'auditoriumId', 'time']),
      response: {
        200: t.ScreeningSchema
      }
    }
  }, async (req, rep) => {
    const res = await m.createScreening(req.body.movieId, 
      req.body.auditoriumId, 
      new Date(req.body.time));

    return rep.ok(res);
  });

  server.delete('/:id', {
    schema: {
      summary: 'Delete screening with given id, requires manager role.',
      security: requireRole('manager'),
      params: Type.Object({
        id: UUID
      })
    }
  }, async (req, rep) => {
    await m.deleteScreening(req.params.id);

    return rep.ok();
  });
}

export default plugin;