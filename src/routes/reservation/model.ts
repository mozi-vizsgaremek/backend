import { pool } from "../../pool";
import { sql, UUID } from "../../types";
import { unwrapCount } from "../../utils";
import { Reservation } from "./types";

export async function createReservation(screeningId: UUID, userId: UUID): Promise<Reservation> {
  return await pool.one(sql.type(Reservation)
    `INSERT INTO reservations (screening_id, user_id, purchase_time)
     VALUES (${screeningId}, ${userId}, now())
     RETURNING *`);
}

export async function getScreeningReservationCount(screeningId: UUID): Promise<number | null> {
  const count = await pool.maybeOne(sql.typeAlias('count')
    `WITH pairs AS 
       (SELECT s.id, a.seats FROM auditoriums a JOIN screenings s ON a.id = s.auditorium_id)
     SELECT count(r.id)
     FROM pairs p JOIN reservations r ON p.id = r.screening_id
     WHERE p.id = ${screeningId}
     GROUP BY p.id`);

  if (!count)
    return 0;

  return unwrapCount(count);
}

export async function deleteReservation(reservationId: UUID): Promise<Reservation | null> {
  return await pool.maybeOne(sql.type(Reservation)
    `DELETE FROM reservations WHERE id = ${reservationId} RETURNING *`);
}

export async function getReservation(reservationId: UUID): Promise<Reservation | null> {
  return await pool.maybeOne(sql.type(Reservation)
    `SELECT * FROM reservations WHERE id = ${reservationId}`);
}

export async function getReservations(userId: UUID): Promise<readonly Reservation[]> {
  return await pool.many(sql.type(Reservation)
    `SELECT * FROM reservations WHERE user_id = ${userId}`);
}

export async function getAllReservations(): Promise<readonly Reservation[]> {
  return await pool.many(sql.type(Reservation)
    `SELECT * FROM reservations`);
}
