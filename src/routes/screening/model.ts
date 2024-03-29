import { pool } from "../../pool";
import { sql, UUID } from "../../types";
import { Screening } from "./types";

export function fixScreening(screening: Screening): Screening {
  return {
    ...screening,
    time: new Date(screening.time)
  }
}

export async function getScreening(id: UUID): Promise<Screening | null> {
  const res = await pool.maybeOne(sql.type(Screening)
    `SELECT s.*, title as movie_title
     FROM screenings s JOIN movies m ON s.movie_id = m.id
     WHERE s.id = ${id}`);

  if (!res) return null;

  return fixScreening(res);
}

export async function getScreenings(): Promise<readonly Screening[]> {
  try {
    const res = await pool.many(sql.type(Screening)
      `SELECT s.*, title as movie_title
       FROM screenings s JOIN movies m ON s.movie_id = m.id`);

    return res.map(x => fixScreening(x));
  } catch {
    return [];
  }
}

export async function createScreening(movieId: UUID, auditoriumId: UUID, time: Date): Promise<Screening> {
  const res = await pool.one(sql.type(Screening)
    `INSERT INTO screenings (movie_id, auditorium_id, time) 
     VALUES (${movieId}, ${auditoriumId}, ${sql.date(time)})
     RETURNING *`);

  return fixScreening(res);
}

export async function deleteScreening(id: UUID) {
  return pool.query(sql.unsafe`DELETE FROM screenings WHERE id = ${id}`);
}
