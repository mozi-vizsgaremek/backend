import { requireRole } from '../../types';
import type { FastifyInstance } from 'fastify';
import { add } from 'date-fns';

import * as m from './model';

export default function (server: FastifyInstance, _opts: null, done: Function) {
  server.get('/', {
    schema: {
      summary: 'Get all shifts in the given time range',
      tags: [ 'shift' ],
      security: requireRole('employee'),
    }
  }, async (_req, rep) => {
    // TODO: implement a way to pass a time range (giving bodies to GET requests is not supported)

    const res = await m.getShifts(new Date(), add(new Date(), { days: 7 }))
    rep.ok(res);
  });

  done()
};
