import { z } from 'zod';

export const User = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  role: z.enum([ 'customer', 'employee', 'manager', 'admin' ]),
  totpSecret: z.string()
});

export type User = z.infer<typeof User>;
