import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';
import { mkError, requireRole, UserRole } from '../../types';

// model types

export const User = z.object({
  id: z.optional(z.string().uuid()), // optional so it doesnt have to be passed on creation
  username: z.string().min(4).max(32),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string(),
  role: UserRole,
  totpSecret: z.optional(z.string()), // same as above
  totpEnabled: z.optional(z.boolean().default(false)),
  managerId: z.optional(z.string().uuid()),
  hourlyWage: z.optional(z.number()),
  hireDate: z.optional(z.date()),
  registrationDate: z.optional(z.date()) 
});

export type User = z.infer<typeof User>;

// schemas

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
      refreshToken: RefreshToken,
      accessToken: AccessToken,
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
    password: Password,
    totp: Type.Optional(TotpCode)
  }),
  response: {
    200: Type.Object({
      refreshToken: RefreshToken,
      accessToken: AccessToken
    }, { description: 'Successful login' }),
    401: mkError({ description: 'Invalid username or password' })
  }
}

export type LoginSchema = Static<typeof LoginSchema.body>;

export const RefreshSchema = {
  summary: 'Issue a new access token',
  tags: [ 'auth' ],
  body: Type.Object({
    refreshToken: Type.String({ description: "The user's refresh token" }) 
  }),
  response: {
    200: Type.Object({
      accessToken: AccessToken
    }, { description: 'Issued new access token' }),
    401: mkError({ description: 'Invalid or expired refresh token' }),
    404: mkError({ description: 'User associated with refresh token not found' })
  }
};

export type RefreshSchema = Static<typeof RefreshSchema.body>;

export const ChangePasswordSchema = {
  summary: 'Change password',
  tags: [ 'auth' ],
  security: requireRole('customer'),
  body: Type.Object({
    oldPassword: Password,
    newPassword: Password
  }),
  response: {
    200: Type.Void({ description: 'Successfully changed password' }),
    403: mkError({ description: 'Old password is invalid' })
  }
}

export type ChangePasswordSchema = Static<typeof ChangePasswordSchema.body>;

// TODO: document TOTP onboarding process

export const EnableTotpSchema = {
  summary: 'Start TOTP onboarding',
  tags: [ 'auth', 'totp' ],
  security: requireRole('customer'),
  response: {
    200: Type.Object({
      secret: Type.String({ description: 'The TOTP shared secret' }),
      uri: Type.String({ description: 'The otpauth URI required to generate a QR code' })
    }),
    403: mkError({ description: 'TOTP is already enabled' })
  }
}

// export type EnableTotpSchema = Static<typeof EnableTotpSchema>;

export const VerifyTotpSchema = {
  summary: 'Complete TOTP onboarding',
  tags: [ 'auth', 'totp' ],
  security: requireRole('customer'),
  body: Type.Object({
    password: Password,
    totp: TotpCode
  })
}

export type VerifyTotpSchema = Static<typeof VerifyTotpSchema.body>;

export const DisableTotpSchema = {
  summary: 'Disable TOTP two-factor authentication',
  tags: [ 'auth', 'totp' ],
  security: requireRole('customer'),
  body: Type.Object({
    password: Password,
    totp: TotpCode
  }) // TODO: add responses
}

export type DisableTotpSchema = Static<typeof DisableTotpSchema.body>;

export const DeleteSchema = {
  summary: 'Delete user',
  tags: [ 'auth' ],
  security: requireRole('customer'),
  body: Type.Object({
    password: Password,
    totp: Type.Optional(TotpCode)
  }) // TODO: add responses
}

export type DeleteSchema = Static<typeof DeleteSchema.body>;

// type aliases

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
  role: UserRole,
  totpEnabled: boolean
}

export type Tokens = {
  refresh: string,
  access: string
};

// service function results

export enum UserServiceResult { 
  ErrorUsernameTaken,
  ErrorInvalidPassword,
  ErrorInvalidUsername,
  ErrorInvalidRefreshToken,
  ErrorInvalidAccessToken,
  ErrorUserNotFound,
  ErrorTotpRequired,
  ErrorTotpNotEnabled,
  ErrorTotpAlreadyEnabled,
  ErrorTotpSecretNotFound,
  ErrorInvalidTotp, 
  Ok 
}
