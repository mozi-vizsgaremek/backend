import { Movie, MovieServiceResult as Result } from './types';
import * as m from './model';
import { UUID } from '../../types';


export async function getMovies(): Promise<readonly Movie[]> {
  let movies: readonly Movie[];

  try {
    movies = await m.getMovies();
  } catch {
    return [];
  }

  return movies;
}

export async function getMovie(id: UUID): Promise<[Result, Movie | null]> {
  const movie = await m.getMovie(id);

  if (!movie)
    return [Result.ErrorMovieNotFound, null];

  return [Result.Ok, movie];
}

/*
export async function createMovie(title: string, subtitle: string, durationMins: number): 
  Promise<[Result, Movie | null]> {
  const movie = await m.createMovie(title, subtitle, durationMins);


}
*/