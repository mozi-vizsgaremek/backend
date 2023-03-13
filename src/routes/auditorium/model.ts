import { pool } from "../../pool";
import { sql, UUID } from "../../types";
import { Auditorium } from "./types";

export async function getAuditorium(id: UUID): Promise<Auditorium | null> {
  return pool.maybeOne(sql.type(Auditorium)
    `SELECT * FROM auditoriums WHERE id = ${id}`);
}

export async function getAuditoriums(): Promise<readonly Auditorium[]> {
  return pool.many(sql.type(Auditorium)
    `SELECT * FROM auditoriums`);
}

export async function createAuditorium(name: string, seats: number): Promise<Auditorium> {
  return pool.one(sql.type(Auditorium)
    `INSERT INTO auditoriums (name, seats) VALUES (${name}, ${seats}) RETURNING *`);
}

export async function deleteAuditorium(id: UUID): Promise<Auditorium | null> {
  return pool.maybeOne(sql.type(Auditorium)
    `DELETE FROM auditoriums WHERE id = ${id} RETURNING *`);
}