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

export const TakenShift = z.object({
  id: z.string().uuid(),
  shiftId: z.string().uuid(),
  userId: z.string().uuid()
});

export type TakenShift = z.infer<typeof TakenShift>;

// schemas

export const DateStr = Type.String({ pattern: '^\\d{4}-[01][1-9]-[0123][1-9]$' }); // date-time and date formats are undefined for some reason
export const DateTimeStr = Type.String({ format: 'date-time', description: "Unix timestamp with milisecond precision" });
// TODO: https://github.com/sinclairzx81/typebox/issues/304 

export const CreateSchema = {
  summary: 'Create a new shift (requires manager role)',
  tags: [ 'shift' ],
  security: requireRole('manager'),
  body: Type.Object({
    from: DateStr,
    to: DateStr,
    requiredStaff: Type.Number({ minimum: 1 })
  }),
  response: {
    200: Type.Object({
      from: DateStr,
      to: DateStr,
      requiredStaff: Type.Number({ minimum: 1 }) 
    })
  }
}

export type CreateSchema = Static<typeof CreateSchema.body>;

export const DeleteSchema = {
  summary: 'Delete specified shift (requires manager role)',
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
  description: 'If the `to` field is ommitted, it will only return the shifts that start on the day specified in `from`. Backend assumes start of day, this makes the `to` field exclusive, and the `from` field inclusive. Date format is YYYY-MM-DD.',
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

