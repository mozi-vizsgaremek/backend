import { Screening } from "./types";

import * as m from './model';

export async function getScreenings(): Promise<readonly Screening[]> {
  let screenings: readonly Screening[];

  try {
    screenings = await m.getScreenings();
  } catch {
    return [];
  }

  return screenings;
}