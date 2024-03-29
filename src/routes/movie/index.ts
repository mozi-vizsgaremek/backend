import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { match, P } from 'ts-pattern';
import { Base64String, requireRole, UUID } from "../../types";

import { config } from '../../config';
import { ScreeningSchema } from '../screening/types';
import { MovieServiceResult as Result } from './types';

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {  
  server.get('/', {
    schema: {
      summary: 'Return a list of all movies',
      tags: [ 'movie' ],
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
      tags: [ 'movie' ],
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

  server.get('/screenings/:id', {
    schema: {
      summary: 'Return all screenings for a given movie',
      security: requireRole('customer'),
      tags: [ 'movie', 'screening' ],
      params: Type.Object({
        id: UUID
      }),
      response: {
        200: Type.Array(ScreeningSchema)
      }
    }
  }, async (req, rep) => {
    const res = await s.getScreeningsByMovie(req.params.id);

    return rep.ok(res);
  });

  server.post('/', {
    schema: {
      summary: 'Create a new movie. Requires admin role',
      tags: [ 'movie' ],
      security: requireRole('admin'),
      body: Type.Pick(t.MovieSchema, ['title', 'subtitle', 'description', 'durationMins']),
      response: {
        200: t.MovieSchema
      }
    }
  }, async (req, rep) => {
    const movie = await m.createMovie(
      req.body.title, 
      req.body.subtitle, 
      req.body.description, 
      req.body.durationMins);

    return rep.ok(movie);
  });

  server.delete('/:id', {
    schema: {
      summary: 'Delete a movie. Requires admin role',
      description: 'Silently fails if movie specified by `id` didn\'t exist beforehand.',
      tags: [ 'movie' ],
      security: requireRole('admin'),
      params: Type.Object({
        id: UUID
      })
    }
  }, async (req, rep) => {
    await s.deleteMovie(req.params.id);
    return rep.ok();
  });

  server.post('/:id/images', {
    schema: {
      summary: 'Upload images for movie specified by `id`.',
      description: 'Both fields are base64 encoded image binaries. Replaces old image if a new one is given.',
      tags: [ 'movie' ],
      security: requireRole('admin'),
      params: Type.Object({
        id: UUID
      }),
      body: Type.Object({
        // passing images as base64 strings might be a terrible workaround 
        // that will come back to haunt me later down the line
        banner: Type.Optional(Base64String),
        thumbnail: Type.Optional(Base64String)
      }),
      response: {
        200: Type.Object({
          movieId: UUID,
          bannerHash: Type.Optional(Base64String),
          bannerUrl: Type.Optional(Type.String()),
          thumbnailHash: Type.Optional(Base64String),
          thumbnailUrl: Type.Optional(Type.String()) 
        })
      }
    } 
  }, async (req, rep) => {
    let resp: any = {};

    for (const key of Object.keys(req.body)) {
      if (!key) continue;

      const ckey = key as keyof (typeof req.body);

      if (!req.body[ckey]) continue;

      const result = await s.uploadImage(req.params.id, key, req.body[ckey]!);

      if (result[0] != Result.Ok)
        return rep.error(500, 'Failed to upload image');      

      resp[`${key}Hash`] = result[1];
      resp[`${key}Url`] = `${config.baseUrl}/u/${result[1]}`;
    }

    resp['movieId'] = req.params.id;

    return rep.ok(resp);
  });

  server.delete('/:id/images/:imageSelector', {
    schema: {
      summary: 'Delete the `:imageSelector` image from movie with `:id`',
      tags: [ 'movie' ],
      security: requireRole('admin'),
      params: Type.Object({
        id: UUID,
        imageSelector: t.ImageType
      })
    }
  }, async (req, rep) => {
    await s.deleteImage(req.params.id, req.params.imageSelector);
    return rep.ok();
  });
}

export default plugin;
