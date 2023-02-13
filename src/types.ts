import { z } from 'zod';
import type { FastifyRequest, RawRequestDefaultExpression, RawServerDefault, } from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { FastifySchema } from 'fastify/types/schema';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { createSqlTag } from 'slonik';
import { ObjectOptions, Static, Type } from '@sinclair/typebox';

export type FastifyRequestTypebox<TSchema extends FastifySchema> = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  TSchema,
  TypeBoxTypeProvider
>;

export const sql = createSqlTag({
  typeAliases: {
    id: z.object({
      id: z.number(),
    }),
    void: z.object({}).strict(),
  }
});

export function mkError(opts: ObjectOptions = { description: 'Generic error' }) {
  return Type.Object({
    statusCode: Type.Number({ description: 'Identical to HTTP status code' }),
    error: Type.String({ description: 'Short description of error (validator errors describe the status code instead)'}),
    message: Type.String({ description: 'Longer description of error' })
  }, opts);
}

export const Error = mkError();

export type Error = Static<typeof Error>;

export const bearerSecurity = { "bearer": [] };
