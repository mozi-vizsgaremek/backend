// import { Static, Type } from '@sinclair/typebox';
import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';
import { requireRole, UUID } from '../../types';

export const Shift = z.object({
  id: z.string().uuid(),
  shiftFrom: z.date(),
  shiftTo: z.date(),
  requiredStaff: z.number()
});

export const CreateShift = Shift.omit({ id: true });
export type CreateShift = z.infer<typeof CreateShift>;

export type Shift = z.infer<typeof Shift>;

export const ShiftWithBookingCount = Shift.extend({
  bookings: z.number().nonnegative()
});

export type ShiftWithBookingCount = z.infer<typeof ShiftWithBookingCount>;

export const TakenShift = z.object({
  id: z.optional(z.string().uuid()),
  shiftId: z.string().uuid(),
  userId: z.string().uuid()
});

export type TakenShift = z.infer<typeof TakenShift>;

export const ExtendedTakenShift =
  TakenShift.extend(Shift.omit({ id: true }).shape);

export type ExtendedTakenShift = z.infer<typeof ExtendedTakenShift>;

// schemas

export const DateStr = Type.String({ pattern: '^\\d{4}-[01][1-9]-[0123][1-9]$' }); // date-time and date formats are undefined for some reason
export const DateTimeStr = Type.String({ format: 'date-time', description: "Unix timestamp with milisecond precision" });
// TODO: https://github.com/sinclairzx81/typebox/issues/304 

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
  querystring: Type.Object({
    id: UUID
  })
}

export type DeleteSchema = Static<typeof DeleteSchema.querystring>;

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
  querystring: Type.Object({
    id: UUID
  })
}

export type BookSchema = Static<typeof BookSchema.querystring>;

export const DeleteBookingSchema = {
  summary: 'Delete a shift booking. Requires employee role',
  description: 'Fails silently if specified booking does not exist.',
  tags: [ 'booking' ],
  security: requireRole('employee'),
  querystring: Type.Object({
    id: UUID
  })
}

export type DeleteBookingSchema = Static<typeof DeleteBookingSchema.querystring>;

export const ListBookingsSchema = {
  summary: "List user's upcoming shift bookings",
  tags: [ 'booking' ],
  security: requireRole('employee')
}

// Service result type

export enum ShiftServiceResult {
  ErrorShiftNotFound,
  ErrorShiftOverbooked,
  Ok
}
