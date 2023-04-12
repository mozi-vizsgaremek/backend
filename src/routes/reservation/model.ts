import { pool } from "../../pool";
import { sql, UUID } from "../../types";
import { unwrapCount } from "../../utils";
import { Reservation, ReservationWithMovie, ReservationWithMovieSchema } from "./types";

function fixReservation(res: Reservation): Reservation {
  return {
    ...res,
    purchaseTime: new Date(res.purchaseTime)
  }
}

function fixReservationWithMovie(res: ReservationWithMovie): ReservationWithMovie {
  const fixedRes = fixReservation(res);

  return {
    ...fixedRes,
    title: res.title,
    time: new Date(res.time)
  };
}

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
  try {
    const res = await pool.many(sql.type(Reservation)
      `SELECT * FROM reservations WHERE user_id = ${userId}`);

    return res.map(x => fixReservation(x));
  } catch {
    return [];
  }
}

export async function getReservationsWithMovies(userId: UUID): Promise<readonly ReservationWithMovie[]> {
  try {
    const res = await pool.many(sql.type(ReservationWithMovie)
      `SELECT r.*, m.title, s.time FROM reservations r
       JOIN screenings s ON r.screening_id = s.id
       JOIN movies m ON s.movie_id = m.id
       WHERE user_id = ${userId}`);

    return res.map(x => fixReservationWithMovie(x));
  } catch (err) {
    console.log(err);

    return [];
  }
}

export async function getAllReservations(): Promise<readonly Reservation[]> {
  return await pool.many(sql.type(Reservation)
    `SELECT * FROM reservations`);
}
