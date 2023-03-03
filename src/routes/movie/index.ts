import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { match, P } from 'ts-pattern';
import { requireRole, UUID } from "../../types";

import { MovieServiceResult as Result } from './types';

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  
  server.get('/', {
    schema: {
      summary: 'Return a list of all movies',
      response: {
        200: Type.Array(t.MovieSchema)
      }
    }
  }, async (req, rep) => {
    const res = await s.getMovies();

    return rep.ok(res);
  });

  server.get('/:id', {
    schema: {
      summary: 'Return the specified movie',
      params: Type.Object({
        id: UUID
      }),
      response: {
        200: t.MovieSchema
      }
    }
  }, async (req, rep) => {
    const res = await s.getMovie(req.params.id);

    return match(res)
      .with([Result.ErrorMovieNotFound, P._], 
        () => rep.error(404, 'Movie not found'))
      .with([Result.Ok, P.select()], 
        movie => rep.ok(movie))
      .run();
  });

  server.post('/', {
    schema: {
      summary: 'Create a new movie. Requires admin role',
      security: requireRole('admin'),
      body: Type.Pick(t.MovieSchema, ['title', 'subtitle', 'durationMins']),
      response: {
        200: t.MovieSchema
      }
    }
  }, async (req, rep) => {
    const movie = await m.createMovie(req.body.title, req.body.subtitle, req.body.durationMins);
    return rep.ok(movie);
  });

  server.delete('/:id', {
    schema: {
      summary: 'Delete a movie. Requires admin role',
      description: 'Silently fails if movie specified by `id` didn\'t exist beforehand.',
      security: requireRole('admin'),
      params: Type.Object({
        id: UUID
      })
    }
  }, async (req, rep) => {
    await m.deleteMovie(req.params.id);
    return rep.ok();
  });
}

export default plugin;