import { Auditorium } from "./types";

import * as m from './model';
import { wrapListGetter } from "../../utils";

export const getAuditoriums = wrapListGetter(m.getAuditoriums);

/*
export async function getAuditoriums(): Promise<readonly Auditorium[]> {
  let auds: readonly Auditorium[];

  try {
    auds = await m.getAuditoriums();
  } catch {
    return [];
  }

  return auds;
}
*/