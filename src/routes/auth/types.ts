import { Static, Type } from '@sinclair/typebox'
import { z } from 'zod';
import { mkError } from '../../types';

// model types

export const UserRole = z.enum([ 'customer', 'employee', 'manager', 'admin' ]).default('customer'); 
export const User = z.object({
  id: z.optional(z.string().uuid()),
  username: z.string().min(4).max(32),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string(),
  role: UserRole,
  totpSecret: z.optional(z.string())
});

export type UserRole = z.infer<typeof UserRole>;
export type User = z.infer<typeof User>;

// schemas

export const Username = Type.String({ minLength: 4, maxLength: 32 });
export type Username = Static<typeof Username>; 

export const Password = Type.String({ minLength: 1 });
export type Password = Static<typeof Password>;

export const RegisterSchema = {
  summary: 'Register a new user',
  tags: [ 'auth' ],
  body: Type.Object({
    username: Username,
    firstName: Type.String({ minLength: 1 }),
    lastName: Type.String({ minLength: 1 }),
    password: Password
  }),
  response: {
    200: Type.Object({
      refreshToken: Type.String({ description: 'The refresh token used to get a new access token' }),
      accessToken: Type.String({ description: 'The bearer token to be passed in the Authorization header to the backend.' })
    }, { description: 'Registration successful.' }),
    400: mkError({ description: 'Username already taken.' })
  }
}

export type RegisterSchema = Static<typeof RegisterSchema.body>;

export const LoginSchema = {
  summary: 'Log in to an existing account',
  tags: [ 'auth' ],
  body: Type.Object({
    username: Username,
    password: Password
  })
}

export type LoginSchema = Static<typeof LoginSchema.body>;


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

export type AccessTokenPayload = TokenPayload & {
  type: 'access',
  username: string,
  firstName: string,
  lastName: string,
  role: UserRole
}

// service function results

export enum UserServiceResult { 
  ErrorUsernameTaken,
  ErrorInvalidPassword,
  ErrorInvalidUsername,
  ErrorInvalidToken, 
  Ok 
}