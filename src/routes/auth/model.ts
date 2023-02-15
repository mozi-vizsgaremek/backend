import { sql } from '../../types';
import { pool } from '../../pool';
import { TotpSecret, User } from './types';

export async function getUser(id: string): Promise<User|null> {
  return pool.maybeOne(sql.type(User)
                       `SELECT * FROM users WHERE id = ${id}`);
}

export async function getUserByNick(username: string): Promise<User|null> {
  return pool.maybeOne(sql.type(User)
                       `SELECT * FROM users WHERE username = ${username}`);
}

export async function createUser(user: User): Promise<void> {
  await pool.query(sql.unsafe
                   `INSERT INTO users (username, password, first_name, last_name)
                    VALUES (${user.username}, ${user.password}, ${user.firstName}, ${user.lastName})`);
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