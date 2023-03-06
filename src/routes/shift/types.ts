// import { Static, Type } from '@sinclair/typebox';
import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';
import { DateStr, DateTimeStr, requireRole, UUID } from '../../types';

export const Shift = z.object({
  id: z.string().uuid(),
  shiftFrom: z.date(),
  shiftTo: z.date(),
  requiredStaff: z.number()
});

export const CreateShift = Shift.omit({ id: true });
export type CreateShift = z.infer<typeof CreateShift>;

export type Shift = z.infer<typeof Shift>;

export const TakenShift = z.object({
  id: z.optional(z.string().uuid()),
  shiftId: z.string().uuid(),
  userId: z.string().uuid()
});

export type TakenShift = z.infer<typeof TakenShift>;

export const ShiftWithBookings = Shift.extend({
  bookedUsers: z.array(z.string().uuid())
});

export type ShiftWithBookings = z.infer<typeof ShiftWithBookings>;


export const ExtendedTakenShift =
  TakenShift.extend(Shift.omit({ id: true }).shape);

export type ExtendedTakenShift = z.infer<typeof ExtendedTakenShift>;

// schemas

export const CreateSchema = {
  summary: 'Create a new shift. Requires manager role',
  tags: [ 'shift' ],
  security: requireRole('manager'),
  body: Type.Object({
    shiftFrom: DateTimeStr,
    shiftTo: DateTimeStr,
    requiredStaff: Type.Number({ minimum: 1 })
  }),
  response: {
    200: Type.Object({
      id: UUID,
      shiftFrom: DateTimeStr,
      shiftTo: DateTimeStr,
      requiredStaff: Type.Number({ minimum: 1 }) 
    })
  }
}

export type CreateSchema = Static<typeof CreateSchema.body>;

export const DeleteSchema = {
  summary: 'Delete specified shift. Requires manager role',
  description: 'Fails silently if given shift does not exist (returns 200)',
  tags: [ 'shift' ],
  security: requireRole('manager'),
  params: Type.Object({
    id: UUID
  })
}

export type DeleteSchema = Static<typeof DeleteSchema.params>;

export const FilterSchema = {
  summary: 'Get all shifts satisfying the given conditions',
  description: 'If the `to` field is ommitted, it will only return the shifts that start on the day specified in `from`. Backend assumes start of day, this makes the `to` field exclusive, and the `from` field inclusive. Date format is YYYY-MM-DD. Requires employee role.',
  tags: [ 'shift' ],
  security: requireRole('employee'),
  body: Type.Object({
    from: DateStr,
    to: Type.Optional(DateStr)
  }),
  response: {
    200: Type.Array(Type.Object({
      id: UUID,
      shiftFrom: DateTimeStr,
      shiftTo: DateTimeStr,
      requiredStaff: Type.Number()
    }))
  }
} 

export type FilterSchema = Static<typeof FilterSchema.body>;

export const BookSchema = {
  summary: 'Book/take a shift. Requires employee role',
  tags: [ 'booking' ],
  security: requireRole('employee'),
  params: Type.Object({
    id: UUID
  })
}

export type BookSchema = Static<typeof BookSchema.params>;

export const DeleteBookingSchema = {
  summary: 'Delete a shift booking. Requires employee role',
  description: 'Fails silently if specified booking does not exist.',
  tags: [ 'booking' ],
  security: requireRole('employee'),
  params: Type.Object({
    id: UUID
  })
}

export type DeleteBookingSchema = Static<typeof DeleteBookingSchema.params>;

export const ListBookingsSchema = {
  summary: "List user's upcoming shift bookings",
  tags: [ 'booking' ],
  security: requireRole('employee')
}

// Service result type

export enum ShiftServiceResult {
  ErrorShiftNotFound,
  ErrorShiftOverbooked,
  ErrorInvalidTimeRange,
  ErrorDuplicateBooking,
  Ok
}
