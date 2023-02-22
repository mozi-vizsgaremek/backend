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
  });
  
  server.post('/filter', {
    schema: FilterSchema
  }, async (req: FastifyRequestTypebox<typeof FilterSchema>, rep) => {
    const from = new Date(req.body.from);

    // default to the same day if `to` is not given
    // this enables the frontend to only fetch a single day's worth of shifts
    const to = req.body.to == null 
      ? add(new Date(req.body.from), { days: 1 }) 
      : new Date(req.body.to);
   
    const res = await m.getShifts(from, to);
    rep.ok(res);
  });

  done()
};
