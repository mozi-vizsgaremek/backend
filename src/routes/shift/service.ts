import type { UUID } from "../../types";
import type { User } from "../auth/types";
import { Shift, ShiftServiceResult as Result, TakenShift } from "./types";

import * as m from './model';

export async function createShift(from: Date, to: Date, requiredStaff: number): Promise<[Result, Shift | null]> {
  if (from > to)
    return [Result.ErrorInvalidTimeRange, null];

  const shift = await m.createShift({
    shiftFrom: from, shiftTo: to, requiredStaff
  });

  return [Result.Ok, shift];
}

export async function bookShift(user: User, shiftId: UUID): Promise<[Result, TakenShift | null]> {
  const shift = await m.getShiftWithBookings(shiftId);

  if (shift == null)
    return [Result.ErrorShiftNotFound, null];

  if (shift.bookedUsers.length >= shift.requiredStaff)
    return [Result.ErrorShiftOverbooked, null];

  if (shift.bookedUsers.includes(user.id!))
    return [Result.ErrorDuplicateBooking, null];

  const booking = await m.bookShift(user, shiftId);

  return [Result.Ok, booking]; 
}
