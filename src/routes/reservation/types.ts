import { Static, Type } from "@sinclair/typebox";
import { z } from "zod";
import { DateTimeStr, UUID } from "../../types";

export const Reservation = z.object({
  id: z.string().uuid(),
  screeningId: z.string().uuid(),
  userId: z.string().uuid(),
  purchaseTime: z.date()
});

export type Reservation = z.infer<typeof Reservation>;

export const ReservationSchema = Type.Object({
  id: UUID,
  screeningId: UUID,
  userId: UUID,
  purchaseTime: DateTimeStr
});

export type ReservationSchema = Static<typeof ReservationSchema>;