import { wrapListGetter } from "../../utils";
import { Reservation } from "./types";

import * as m from './model';
import { UUID } from "../../types";

export const getReservations: (userId: UUID) => Promise<readonly Reservation[]> = wrapListGetter(m.getReservations);
export const getAllReservations: () => Promise<readonly Reservation[]> = wrapListGetter(m.getAllReservations);