import { pool } from '../../pool';
import { sql } from '../../types';
import { Shift } from './types';

export async function getShifts(from: Date, to: Date): Promise<readonly Shift[]> {
  return pool.many(sql.type(Shift)
                   `SELECT * FROM shifts WHERE shift_from >= ${sql.date(from)} AND shift_to <= ${sql.date(to)}`);
}
