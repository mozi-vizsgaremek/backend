import type { User } from '../auth/types';
import { pool } from '../../pool';
import { sql, UUID } from '../../types';
import { CreateShift, ExtendedTakenShift, Shift, ShiftWithBookings, TakenShift } from './types';

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

export async function getShiftWithBookings(id: UUID): Promise<ShiftWithBookings | null> {
  return pool.maybeOne(sql.type(ShiftWithBookings)
    `SELECT s.*, array_agg(st.user_id) AS booked_users
     FROM shifts s LEFT JOIN shifts_taken st ON s.id = st.shift_id
     WHERE s.id = ${id}
     GROUP BY s.id`);
}

export async function getShifts(from: Date, to: Date): Promise<readonly Shift[]> {
  try {
    const res = await pool.many(sql.type(Shift)
      `SELECT * FROM shifts 
       WHERE shift_from >= ${sql.timestamp(from)} AND shift_to <= ${sql.date(to)}
       ORDER BY shift_from, (shift_to - shift_from) DESC`);

    return res.map(fixShift);
  } catch {
    return [];
  }
}

export async function createShift(shift: CreateShift): Promise<Shift> {
  const res = await pool.one(sql.type(Shift)
    `INSERT INTO shifts (shift_from, shift_to, required_staff) 
     VALUES (${sql.timestamp(shift.shiftFrom)}, ${sql.timestamp(shift.shiftTo)}, ${shift.requiredStaff})
     RETURNING *`);

  return fixShift(res);
}

export async function deleteShift(id: UUID) {
  await pool.query(sql.unsafe
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
  try {
    const res = await pool.many(sql.type(ExtendedTakenShift)
      `SELECT *
       FROM shifts_taken JOIN shifts ON shifts_taken.shift_id = shifts.id
       WHERE user_id = ${user.id!} AND shift_to > now()`); // i'm using shift_to here so the current shift is still included

    return res.map(x => ({
      ...x,
      shiftFrom: new Date(x.shiftFrom),
      shiftTo: new Date(x.shiftTo)
    }));
  } catch {
    return [];
  }
}
