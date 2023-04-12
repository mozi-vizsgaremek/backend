import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { requireRole, UUID } from "../../types";

import * as am from '../auditorium/model';
import * as as from '../screening/model';
import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  server.get('/', {
    schema: {
      summary: 'List all reservations, only returns reservations for the calling user',
      security: requireRole('customer'),
      tags: [ 'reservation' ],
      response: {
        200: Type.Array(t.ReservationWithMovieSchema)
      }
    }
  }, async (req, rep) => {
    const res = await m.getReservationsWithMovies(req.user.id!);

    return rep.ok(res);
  });

  server.get('/admin', {
    schema: {
      summary: 'List all reservations, requires admin role.',
      security: requireRole('admin'),
      tags: [ 'reservation' ],
      response: {
        200: Type.Array(t.ReservationSchema)
      }
    }
  }, async (req, rep) => {
    const res = await s.getAllReservations();

    return rep.ok(res);
  });

  server.post('/:id', {
    schema: {
      summary: 'Reserve n amount of seats for screening with `id`',
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
    // race condition :)
    // should probably use transactions here
    // or implement this in PL/pgSQL
    const reservationCount = await m.getScreeningReservationCount(req.params.id);
    const screening = await as.getScreening(req.params.id);

    if (reservationCount == null || !screening)
      return rep.error(404, 'No such screening');

    const aud = await am.getAuditorium(screening.auditoriumId);

    if (!aud)
      return rep.error(404, 'Screening auditorium not found');

    if (reservationCount >= aud.seats)
      return rep.error(400, 'Screening sold out');

    if (reservationCount + req.body.seats > aud.seats)
      return rep.error(400, 'Not enough free seats available');

    // this is an actual warcrime
    // i need to be shot for writing this
    // but im too lazy to write a decent solution to this :)
    const createPromises 
      = [...Array(req.body.seats).keys()]                           // create n length array
      .map(() => m.createReservation(req.params.id, req.user.id!)); // insert n new rows
      
    // wait for all of the promises
    const reservations = await Promise.all(createPromises);

    return rep.ok(reservations);
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
