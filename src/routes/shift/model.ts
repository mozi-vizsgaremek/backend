import type { User } from '../auth/types';
import { pool } from '../../pool';
import { sql, UUID } from '../../types';
import { CreateShift, ExtendedTakenShift, Shift, ShiftWithBookingCount, TakenShift } from './types';

export function fixShift(shift: Shift): Shift {
  return {
    ...shift,
    shiftFrom: new Date(shift.shiftFrom),
    shiftTo: new Date(shift.shiftTo)
  };
}

export async function getShift(id: UUID): Promise<Shift | null> {
  return pool.maybeOne(sql.type(Shift)
    `SELECT * FROM shifts WHERE id = ${id}`);
}

export async function getShiftWithBookingCounts(id: UUID): Promise<ShiftWithBookingCount | null> {
  const subquery = sql.typeAlias('number')
    `SELECT count(id) FROM shifts_taken WHERE shift_id = ${id}`;

  return pool.maybeOne(sql.type(ShiftWithBookingCount)
    `SELECT *, (${subquery}) as bookings 
     FROM shifts WHERE id = ${id}`);
}

export async function getShifts(from: Date, to: Date): Promise<readonly Shift[]> {
  const res = await pool.many(sql.type(Shift)
    `SELECT * FROM shifts 
     WHERE shift_from >= ${sql.date(from)} AND shift_to <= ${sql.date(to)}
     ORDER BY shift_from, (shift_to - shift_from) DESC`);

  return res.map(fixShift);
}

export async function createShift(shift: CreateShift): Promise<Shift> {
  const res = await pool.one(sql.type(Shift)
    `INSERT INTO shifts (shift_from, shift_to, required_staff) 
     VALUES (${sql.date(shift.shiftFrom)}, ${sql.date(shift.shiftTo)}, ${shift.requiredStaff})
     RETURNING *`);

  return fixShift(res);
}

export async function deleteShift(id: UUID) {
  return await pool.query(sql.unsafe
    `DELETE FROM shifts WHERE id = ${id}`);
}

export async function bookShift(user: User, shiftId: UUID): Promise<TakenShift> {
  return await pool.one(sql.type(TakenShift)
    `INSERT INTO shifts_taken (shift_id, user_id)
     VALUES (${shiftId}, ${user.id!})
     RETURNING *`);
}

export async function deleteBooking(bookingId: UUID) {
  return await pool.query(sql.unsafe
    `DELETE FROM shifts_taken WHERE id = ${bookingId}`);
}

// REVIEW: to - from range like with getShifts?
export async function getBookings(user: User): Promise<readonly ExtendedTakenShift[]> {
  return await pool.many(sql.type(ExtendedTakenShift)
    `SELECT *
     FROM shifts_taken JOIN shifts ON shifts_taken.shift_id = shifts.id
     WHERE user_id = ${user.id!} AND shift_to > now()`); // i'm using shift_to here so the current shift is still included
}
