import { pool } from "../../pool";
import { sql, UUID } from "../../types";
import { Movie } from "./types";

export async function getMovies(): Promise<readonly Movie[]> {
  return pool.many(sql.type(Movie)
    `SELECT * FROM movies`);
}

export async function getMovie(id: UUID): Promise<Movie | null> {
  return pool.maybeOne(sql.type(Movie)
    `SELECT * FROM movies WHERE id = ${id}`);
}

export async function createMovie(title: string, subtitle: string, durationMins: number): Promise<Movie> {
  return pool.one(sql.type(Movie)
    `INSERT INTO movies (title, subtitle, duration_mins)
     VALUES (${title}, ${subtitle}, ${durationMins})
     RETURNING *`);
}

export async function deleteMovie(id: UUID) {
  return pool.query(sql.unsafe`DELETE FROM movies WHERE id = ${id}`);
}