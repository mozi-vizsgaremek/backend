import { Static, Type } from '@sinclair/typebox'
import { z } from 'zod';

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
  body: Type.Object({
    username: Type.String({ minLength: 4, maxLength: 32 }),
    firstName: Type.String({ minLength: 1 }),
    lastName: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 })
  })
}

export type RegisterUserSchema = Static<typeof RegisterUserSchema.body>;
