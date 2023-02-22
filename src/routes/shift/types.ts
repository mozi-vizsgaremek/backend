// import { Static, Type } from '@sinclair/typebox';
import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';
import { requireRole } from '../../types';

export const Shift = z.object({
  id: z.string().uuid(),
  shiftFrom: z.date(),
  shiftTo: z.date(),
  requiredStaff: z.number(),
  requiredManagers: z.number()
});

export type Shift = z.infer<typeof Shift>;

export const TakenShift = z.object({
  id: z.string().uuid(),
  shiftId: z.string().uuid(),
  userId: z.string().uuid()
});

export type TakenShift = z.infer<typeof TakenShift>;

// schemas

export const FilterSchema = {
  summary: 'Get all shifts satisfying the given conditions',
  tags: [ 'shift' ],
  security: requireRole('employee'),
  body: Type.Object({
    from: Type.String({ format: 'date-time' }),
    to: Type.Optional(Type.String({ format: 'date-time' }))
  })
} 

export type FilterSchema = Static<typeof FilterSchema.body>;

