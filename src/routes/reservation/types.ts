import { Static, Type } from "@sinclair/typebox";
import { z } from "zod";
import { DateTimeStr, UUID } from "../../types";
import { Movie, MovieSchema } from "../movie/types";

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

export const ReservationWithMovie = Reservation.extend({
  title: z.string(),
  time: z.date()
});

export type ReservationWithMovie = z.infer<typeof ReservationWithMovie>;

// Type.Composite does not exist for whatever reason
export const ReservationWithMovieSchema = Type.Object({
  ...ReservationSchema.properties,
  title: Type.String(),
  time: DateTimeStr
});

export type ReservationWithMovieSchema = Static<typeof ReservationWithMovieSchema>;