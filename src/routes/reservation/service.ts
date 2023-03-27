import { wrapListGetter } from "../../utils";
import { Reservation } from "./types";

import * as m from './model';

export const getReservations: () => Promise<readonly Reservation[]> = wrapListGetter(m.getReservations);
