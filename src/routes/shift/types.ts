// import { Static, Type } from '@sinclair/typebox';
import { z } from 'zod';

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
