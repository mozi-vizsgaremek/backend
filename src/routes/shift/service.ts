import type { UUID } from "../../types";
import type { User } from "../auth/types";
import { Shift, ShiftServiceResult as Result } from "./types";

import * as m from './model';

export async function createShift(from: Date, to: Date, requiredStaff: number): Promise<[Result, Shift | null]> {
  if (from > to)
    return [Result.ErrorInvalidTimeRange, null];
  
  const shift = await m.createShift({
    shiftFrom: from, shiftTo: to, requiredStaff
  });

  return [Result.Ok, shift];
}

export async function bookShift(user: User, shiftId: UUID): Promise<Result> {
  const shift = await m.getShiftWithBookings(shiftId);

  console.log(shift);

  if (shift == null)
    return Result.ErrorShiftNotFound;

  if (shift.bookedUsers.length >= shift.requiredStaff)
    return Result.ErrorShiftOverbooked;

  if (shift.bookedUsers.includes(user.id!))
    return Result.ErrorDuplicateBooking;

  await m.bookShift(user, shiftId);

  return Result.Ok; 
}
