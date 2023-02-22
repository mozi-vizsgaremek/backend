import type { FastifyRequestTypebox } from '../../types';
import { CreateSchema, FilterSchema, CreateShift, DeleteSchema } from './types';
import type { FastifyInstance } from 'fastify';
import { add } from 'date-fns';

import * as m from './model';

export default function (server: FastifyInstance, _opts: null, done: Function) {
  server.post('/', {
    schema: CreateSchema
  }, async (req: FastifyRequestTypebox<typeof CreateSchema>, rep) => {
    const shiftInput: CreateShift = {
      ...req.body,
      shiftFrom: new Date(req.body.from),
      shiftTo: new Date(req.body.to)
    }

    const res = await m.createShift(shiftInput);
    
    return rep.ok(res);
  });

  server.delete('/:id', {
    schema: DeleteSchema,
  }, async (req: FastifyRequestTypebox<typeof DeleteSchema>, rep) => {
    await m.deleteShift(req.query.id);
    return rep.ok();
  })
  
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
