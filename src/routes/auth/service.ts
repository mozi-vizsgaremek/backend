import type { RegisterUserSchema } from "./types";
import { hash } from 'argon2';

import * as m from './model';

export async function createUser(input: RegisterUserSchema) {
  await m.createUser({
    username: input.username,
    password: await hash(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'customer'
  });
}
