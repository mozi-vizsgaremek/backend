import type { UUID } from "../../types";
import type { User } from "../auth/types";
import { ShiftServiceResult as Result } from "./types";

import * as m from './model';

export async function bookShift(user: User, shiftId: UUID): Promise<Result> {
  const shift = await m.getShiftWithBookingCounts(shiftId);

  if (shift == null)
    return Result.ErrorShiftNotFound;

  if (shift.bookings >= shift.requiredStaff)
    return Result.ErrorShiftOverbooked;

  await m.bookShift(user, shiftId);

  return Result.Ok; 
}
