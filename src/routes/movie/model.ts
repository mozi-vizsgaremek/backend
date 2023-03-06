import { z } from "zod";
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

export async function createMovie(title: string, subtitle: string, description: string, durationMins: number): Promise<Movie> {
  return pool.one(sql.type(Movie)
    `INSERT INTO movies (title, subtitle, description, duration_mins)
     VALUES (${title}, ${subtitle}, ${description}, ${durationMins})
     RETURNING *`);
}

export async function deleteMovie(id: UUID): Promise<Movie | null> {
  return pool.maybeOne(sql.type(Movie)
    `DELETE FROM movies WHERE id = ${id} RETURNING *`);
}

export async function getThumbnail(id: UUID): Promise<string | null> {
  return pool.maybeOne(sql.typeAlias('string')
    `SELECT thumbnail_path FROM movies WHERE id = ${id}`);
}

export async function getBanner(id: UUID): Promise<string | null> {
  return pool.maybeOne(sql.typeAlias('string')
    `SELECT banner_path FROM movies WHERE id = ${id}`);
}

export async function updateThumbnail(id: UUID, hash: string | null = null) {
  await pool.query(sql.unsafe`UPDATE movies SET thumbnail_path = ${hash} WHERE id = ${id}`);
}

export async function updateBanner(id: UUID, hash: string | null = null) {
  await pool.query(sql.unsafe`UPDATE movies SET banner_path = ${hash} WHERE id = ${id}`);
}

export async function imageUseCount(hash: string): Promise<number> {
  return (await pool.one(sql.typeAlias('count')
    `SELECT count(*) as count FROM movies 
     WHERE thumbnail_path = ${hash} OR banner_path = ${hash}`)).count;
}