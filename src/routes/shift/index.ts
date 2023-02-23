import type { FastifyRequestTypebox } from '../../types';
import { CreateSchema, FilterSchema, DeleteSchema, BookSchema, DeleteBookingSchema, ShiftServiceResult as Result, ListBookingsSchema } from './types';
import type { FastifyInstance } from 'fastify';
import { add } from 'date-fns';
import { match, P } from 'ts-pattern';

import * as s from './service';
import * as m from './model';

export default function (server: FastifyInstance, _opts: null, done: Function) {
  server.post('/', {
    schema: CreateSchema
  }, async (req: FastifyRequestTypebox<typeof CreateSchema>, rep) => {
    const res = await s.createShift(
      new Date(req.body.shiftFrom),
      new Date(req.body.shiftTo),
      req.body.requiredStaff);

    return match(res)
      .with([Result.ErrorInvalidTimeRange, P._],
        () => rep.error(400, 'Invalid time range'))
      .with([Result.Ok, P.select()],
        shift => rep.ok(shift))
      .run();      
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

  server.post('/book/:id', {
    schema: BookSchema
  }, async (req: FastifyRequestTypebox<typeof BookSchema>, rep) => {
    const res = await s.bookShift(req.user, req.query.id);

    return match(res)
      .with(Result.ErrorShiftNotFound,
        () => rep.error(404, 'Shift not found'))
      .with(Result.ErrorShiftOverbooked,
        () => rep.error(403, 'Shift overbooked'))
      .with(Result.Ok,
        () => rep.ok())
      .run();
  });

  server.delete('/book/:id', {
    schema: DeleteBookingSchema
  }, async (req: FastifyRequestTypebox<typeof DeleteBookingSchema>, rep) => {
    await m.deleteBooking(req.query.id);
    return rep.ok();
  });

  server.get('/book/', {
    schema: ListBookingsSchema
  }, async (req: FastifyRequestTypebox<typeof ListBookingsSchema>, rep) => {
    const res = await m.getBookings(req.user);
    return rep.ok(res);
  });

  done()
};
