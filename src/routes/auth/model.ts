import { sql } from '../../types';
import { pool } from '../../pool';
import { User } from './types';

export async function getUser(id: string): Promise<User|null> {
  return pool.maybeOne(sql.type(User)
                       `SELECT id, username FROM users WHERE id = ${id}`);
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
