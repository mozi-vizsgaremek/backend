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
  description: z.string(),
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
  description: Type.String(),
  durationMins: Type.Integer({ minimum: 1 }),
  thumbnailUrl: Type.Optional(Type.String()),
  bannerUrl: Type.Optional(Type.String())
});

export type MovieSchema = Static<typeof MovieSchema>;

export const ImageType = Type.Union(['thumbnail', 'banner'].map(x => Type.Literal(x)));
export type ImageType = Static<typeof ImageType>;