import { sql, TotpSecret } from '../../types';
import { pool } from '../../pool';
import { User } from './types';

export async function getUserCount(): Promise<number> {
  return (await pool.one(sql.typeAlias('count')
    `SELECT count(id) FROM users`)).count;
}

export async function getUser(id: string): Promise<User|null> {
  const user = await pool.maybeOne(sql.type(User)
    `SELECT * FROM users WHERE id = ${id}`);

  if (!user) return null;

  return ({
    ...user,
    hireDate: user.hireDate ? new Date(user.hireDate) : undefined,
    registrationDate: user.registrationDate ? new Date(user.registrationDate) : undefined
  }); // TODO: find a better way to do this
}

export async function getUserByNick(username: string): Promise<User|null> {
  return pool.maybeOne(sql.type(User)
    `SELECT * FROM users WHERE username = ${username}`);
}

export async function createUser(user: User): Promise<User> {
  return await pool.one(sql.type(User)
    `INSERT INTO users (username, password, first_name, last_name, role)
     VALUES (${user.username}, ${user.password}, ${user.firstName}, ${user.lastName}, ${user.role})
     RETURNING *`);
}

export async function userExistsByNick(username: string): Promise<boolean> {
  return pool.exists(sql.typeAlias('void')
    `SELECT id FROM users WHERE username ILIKE ${username}`);
}

export async function userExists(id: string): Promise<boolean> {
  return pool.exists(sql.typeAlias('void')`SELECT id FROM users WHERE id = ${id}`);  
}

export async function hasTotpEnabled(id: string): Promise<boolean> {
  return pool.one(sql.typeAlias('bool')
    `SELECT totp_enabled FROM users WHERE id = ${id}`);
}

export async function hasTotpSecret(id: string): Promise<boolean> {
  return pool.one(sql.typeAlias('bool')
    `SELECT totp_secret IS NOT NULL FROM users WHERE id = ${id}`);
}

export async function setTotpSecret(user: User, secret: TotpSecret) {
  return pool.query(sql.unsafe
    `UPDATE users SET totp_secret = ${secret} WHERE id = ${user.id!}`);
}

export async function setTotpStatus(user: User, status: boolean) {
  return pool.query(sql.unsafe
    `UPDATE users SET totp_enabled = ${status} WHERE id = ${user.id!}`);
}

export async function setPassword(user: User, hash: string) {
  return pool.query(sql.unsafe
    `UPDATE users SET password = ${hash} WHERE id = ${user.id!}`);
}

export async function deleteUser(user: User) {
  return pool.query(sql.unsafe`DELETE FROM users WHERE id = ${user.id!}`);
}

export async function getUsers(): Promise<readonly User[]> {
  const res = await pool.many(sql.type(User)
    `SELECT * FROM users`);

  return res.map(x => ({
    ...x,
    hireDate: x.hireDate ? new Date(x.hireDate) : undefined,
    registrationDate: x.registrationDate ? new Date(x.registrationDate) : undefined
  })); // find a better way to do this
}

export async function updateUser(user: User) {
  return pool.query(sql.unsafe
    `UPDATE users SET 
      username = ${user.username},
      first_name = ${user.firstName},
      last_name = ${user.lastName},
      password = ${user.password},
      role = ${user.role},
      totp_enabled = ${user.totpEnabled ?? false},
      hourly_wage = ${user.hourlyWage ?? null},
      manager_id = ${user.managerId ?? null}
     WHERE id = ${user.id!}`);
}