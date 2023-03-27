import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { requireRole, UUID } from "../../types";

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  server.get('/', {
    schema: {
      summary: 'List all reservations, requires manager role.',
      security: requireRole('manager'),
      tags: [ 'reservation' ]
    }
  }, async (req, rep) => {

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
