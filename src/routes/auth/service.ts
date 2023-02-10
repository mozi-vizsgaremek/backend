import { RegisterUserSchema, UserServiceResult } from "./types";
import { hash } from 'argon2';

import * as m from './model';

export async function createUser(input: RegisterUserSchema): Promise<UserServiceResult> {
  if (await m.userExists(input.username))
    return UserServiceResult.ErrorUsernameTaken;  

  await m.createUser({
    username: input.username,
    password: await hash(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'customer'
  });

  return UserServiceResult.Ok;
}
