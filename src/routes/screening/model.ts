import { pool } from "../../pool";
import { sql, UUID } from "../../types";
import { Screening } from "./types";

export async function getScreening(id: UUID): Promise<Screening | null> {
  return pool.maybeOne(sql.type(Screening)
    `SELECT * FROM screenings WHERE id = ${id}`);
}

export async function getScreenings(): Promise<readonly Screening[]> {
  return pool.many(sql.type(Screening)
    `SELECT * FROM screenings`);
}

// export async function createScreening(movieId: UUID, auditoriumId: UUID, time: Date): Promise<Screening> {
  // TODO: implement  
// }