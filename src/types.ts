import { z } from 'zod';
import type { FastifyRequest, RawRequestDefaultExpression, RawServerDefault, } from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { FastifySchema } from 'fastify/types/schema';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Format } from '@sinclair/typebox/format';
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
    bool: z.boolean(),
    number: z.number(),
    count: z.object({ count: z.number() }),
    string: z.string()
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

// Access stuff

export const UserRole = z.enum([ 'customer', 'employee', 'manager', 'admin' ]).default('customer'); 
export type UserRole = z.infer<typeof UserRole>;
export const UserRoleLevel: { [key: string]: number } = {
  'customer': 0,
  'employee': 1,
  'manager': 2,
  'admin': 3
}

export function requireRole(role: UserRole = 'customer'): [ { [key: string]: string[] } ] {
  return [ { 'bearer': [ role ] } ];
}

export const UserRoleSchema = Type.Union(['customer', 'employee', 'manager', 'admin'].map(x => Type.Literal(x)));
export type UserRoleSchema = Static<typeof UserRoleSchema>;

// common schema types

export const UUID = Type.String({ format: 'uuid' });
export type UUID = Static<typeof UUID>;

export const Base64String = Type.String({ pattern: '^[a-zA-Z0-9+/]+={0,2}$' });
export type Base64String = Static<typeof Base64String>;

export const Username = Type.String({ minLength: 4, maxLength: 32, pattern: '^([A-Za-z0-9_-]){4,32}$' });
export type Username = Static<typeof Username>; 

export const Password = Type.String({ minLength: 8, maxLength: 256, pattern: '^[A-Za-z0-9!@#$%&^_\W]{8,256}$' });
export type Password = Static<typeof Password>;

export const RefreshToken = Type.String({ description: 'The refresh token used to get a new access token' });
export type RefreshToken = Static<typeof RefreshToken>;

export const AccessToken = Type.String({ description: 'The bearer token to be passed in the Authorization header to the backend.' });
export type AccessToken = Static<typeof AccessToken>; 

export const TotpCode = Type.String({ minLength: 6, maxLength: 6, pattern: '^[0-9]{6}$' });
export type TotpCode = Static<typeof TotpCode>;

export const TotpSecret = Type.String();
export type TotpSecret = Static<typeof TotpSecret>;

// Typebox formats

// NOTE: stolen from https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts#L105
Format.Set('date-time', val => /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i.test(val));
Format.Set('uuid', val => /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(val));

export const DateStr = Type.String({ pattern: '^\\d{4}-[01][1-9]-[0123][0-9]$' }); // date-time and date formats are undefined for some reason
export const DateTimeStr = Type.String({ format: 'date-time', description: "Unix timestamp with milisecond precision" });
// TODO: https://github.com/sinclairzx81/typebox/issues/304 