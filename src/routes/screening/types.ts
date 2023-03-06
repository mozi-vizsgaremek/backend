import { Static, Type } from "@sinclair/typebox";
import { z } from "zod";
import { DateTimeStr, UUID } from "../../types";

export const Screening = z.object({
  id: z.string().uuid(),
  movieId: z.string().uuid(),
  auditoriumId: z.string(),
  time: z.date()
});

export type Screening = z.infer<typeof Screening>;

export const ScreeningSchema = Type.Object({
  id: UUID,
  movieId: UUID,
  auditoriumId: UUID,
  time: DateTimeStr
});

export type ScreeningSchema = Static<typeof ScreeningSchema>;