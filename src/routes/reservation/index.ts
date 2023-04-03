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

  server.post('/', {
    schema: {
      summary: 'Reserve n amount of seats',
      security: requireRole('customer'),
      tags: [ 'reservation' ],
      body: Type.Object({
        seats: Type.Number({ min: 1 })
      })
    }
  }, async (req, rep) => {
    
  });
}

export default plugin;
