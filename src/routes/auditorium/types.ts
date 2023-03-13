import { Static, Type } from "@sinclair/typebox";
import { z } from "zod";
import { UUID } from "../../types";

export const Auditorium = z.object({
  id: z.string().uuid(),
  name: z.string(),
  seats: z.number()
});

export type Auditorium = z.infer<typeof Auditorium>;

export const AuditoriumSchema = Type.Object({
  id: UUID,
  name: Type.String(),
  seats: Type.Number()
});

export type AuditoriumSchema = Static<typeof AuditoriumSchema>;