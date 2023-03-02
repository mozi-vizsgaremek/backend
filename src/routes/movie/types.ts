import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';
import { UUID } from '../../types';

// result type

export enum MovieServiceResult {
  ErrorMovieNotFound,
  Ok
}

// database models

export const Movie = z.object({
  id: z.string().uuid(),
  title: z.string(),
  subtitle: z.string(),
  durationMins: z.number(),
  thumbnailPath: z.string(),
  bannerPath: z.string()
}).partial({ id: true });

export type Movie = z.infer<typeof Movie>;

// schemas

export const MovieSchema = Type.Object({
  id: UUID,
  title: Type.String(),
  subtitle: Type.String(),
  durationMins: Type.Integer(),
  thumbnailUrl: Type.Optional(Type.String()),
  bannerUrl: Type.Optional(Type.String())
});

export type MovieSchema = Static<typeof MovieSchema>;