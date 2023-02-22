import type { FastifyRequestTypebox } from '../../types';
import { FilterSchema } from './types';
import type { FastifyInstance } from 'fastify';

import * as m from './model';
import { add } from 'date-fns';

export default function (server: FastifyInstance, _opts: null, done: Function) {
  server.post('/filter', {
    schema: FilterSchema
  }, async (req: FastifyRequestTypebox<typeof FilterSchema>, rep) => {
    const from = new Date(req.body.from);

    // default to a week if `to` is not given
    const to = new Date(req.body.to ?? add(from, { days: 7 }));
    
    const res = await m.getShifts(from, to);
    rep.ok(res);
  });

  done()
};
