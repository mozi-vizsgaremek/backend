import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { requireRole, UUID } from "../../types";

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  server.get('/', {
    schema: {
      summary: 'List all reservations, only returns reservations for the calling user',
      security: requireRole('customer'),
      tags: [ 'reservation' ]
    }
  }, async (req, rep) => {
    const res = await s.getReservations(req.user.id!);

    return rep.ok(res);
  });

  server.get('/admin', {
    schema: {
      summary: 'List all reservations, requires admin role.',
      security: requireRole('admin'),
      tags: [ 'reservation' ]
    }
  }, async (req, rep) => {
    const res = await s.getAllReservations();

    return rep.ok(res);
  });

  server.post('/:id', {
    schema: {
      summary: 'Reserve n amount of seats for movie with `id`',
      security: requireRole('customer'),
      tags: [ 'reservation' ],
      params: Type.Object({
        id: UUID
      }),
      body: Type.Object({
        seats: Type.Number({ min: 1 })
      })
    }
  }, async (req, rep) => {
    
  });

  server.delete('/:id', {
    schema: {
      summary: 'Delete a reservation',
      security: requireRole('customer'),
      tags: [ 'reservation' ],
      params: Type.Object({
        id: UUID
      })
    }
  }, async (req, rep) => {
    await m.deleteReservation(req.params.id);

    rep.ok();
  });
}

export default plugin;
