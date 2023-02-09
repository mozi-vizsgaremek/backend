import { z } from 'zod';
import type { FastifyRequest, RawRequestDefaultExpression, RawServerDefault, } from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { FastifySchema } from 'fastify/types/schema';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { createSqlTag } from 'slonik';

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
