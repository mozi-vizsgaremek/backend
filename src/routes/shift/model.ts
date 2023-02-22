import { pool } from '../../pool';
import { sql, UUID } from '../../types';
import { CreateShift, Shift, ShiftWithBookingCount } from './types';

export async function getShift(id: UUID): Promise<Shift|null> {
  return pool.maybeOne(sql.type(Shift)
    `SELECT * FROM shifts WHERE id = ${id}`);
}

export async function getShiftWithBookingCounts(id: UUID): Promise<ShiftWithBookingCount|null> {
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

  return res.map(x => ({
    ...x,
    shiftFrom: new Date(x.shiftFrom),
    shiftTo: new Date(x.shiftTo)
  }))
}

export async function createShift(shift: CreateShift): Promise<Shift> {
  return await pool.one(sql.type(Shift)
    `INSERT INTO shifts (shift_from, shift_to, required_staff) 
     VALUES (${sql.date(shift.shiftFrom)}, ${sql.date(shift.shiftTo)}, ${shift.requiredStaff})
     RETURNING *`);
}

export async function deleteShift(id: UUID) {
  return await pool.query(sql.unsafe
    `DELETE FROM shifts WHERE id = ${id}`);
}

export async function bookShift(user: User) {
  // TODO: finish implementation
}