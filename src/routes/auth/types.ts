import { Static, Type } from '@sinclair/typebox'
import { z } from 'zod';
import { mkError } from '../../types';

// model types

export const User = z.object({
  id: z.optional(z.string().uuid()),
  username: z.string().min(4).max(32),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string(),
  role: z.enum([ 'customer', 'employee', 'manager', 'admin' ]).default('customer'),
  totpSecret: z.optional(z.string())
});

export type User = z.infer<typeof User>;

// schemas

export const RegisterUserSchema = {
  description: 'Register a new user',
  tags: [ 'auth' ],
  body: Type.Object({
    username: Type.String({ minLength: 4, maxLength: 32 }),
    firstName: Type.String({ minLength: 1 }),
    lastName: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 })
  }),
  response: {
    200: Type.Object({
      refreshToken: Type.String({ description: 'The refresh token used to get a new access token' }),
      accessToken: Type.String({ description: 'The bearer token to be passed in the Authorization header to the backend.' })
    }, { description: 'Registration successful.' }),
    400: mkError({ description: 'Username already taken.' })
  }
}

export type RegisterUserSchema = Static<typeof RegisterUserSchema.body>;

// type aliases

export type RefreshToken = string;
export type AccessToken = string;

export type TokenPayload = {
  id: string, // user uuid
  type: string
}

export type RefreshTokenPayload = TokenPayload & {
  type: 'refresh'
}

// service function results

export enum UserServiceResult { 
  ErrorUsernameTaken, 
  Ok 
}