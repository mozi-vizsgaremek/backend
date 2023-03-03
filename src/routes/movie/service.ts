import { ImageType, Movie, MovieServiceResult as Result } from './types';
import * as m from './model';
import { UUID } from '../../types';
import { match } from 'ts-pattern';
import { saveImage } from './files';

import * as f from './files';

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

export async function getImage(id: UUID, imgType: ImageType): Promise<[Result, string | null]> {
  const getter = match(imgType)
    .with('banner', () => m.getBanner)
    .with('thumbnail', () => m.getThumbnail)
    .run();
  
  const img = await getter(id);

  if (!img)
    return [Result.ErrorMovieNotFound, null];

  return [Result.Ok, img];
}

export async function uploadImage(id: UUID, imgType: ImageType, imgData: string) {
  const imageHash = await saveImage(imgData);

  await match(imgType)
    .with('banner', async () => m.updateBanner(id, imageHash))
    .with('thumbnail', async () => m.updateThumbnail(id, imageHash))
    .run();
}

export async function deleteImage(id: UUID, imgType: ImageType): Promise<Result> {
  const img = await getImage(id, imgType);

  if (img[0] != Result.Ok)
    return img[0];

  await match(imgType)
    .with('banner', async () => m.updateBanner(id, null))
    .with('thumbnail', async () => m.updateThumbnail(id, null))
    .run();

  return Result.Ok;
}