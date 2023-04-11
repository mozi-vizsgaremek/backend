import { ImageType, Movie, MovieSchema, MovieServiceResult as Result } from './types';
import * as m from './model';
import { UUID } from '../../types';
import { match } from 'ts-pattern';
import { saveImage } from './files';

import * as f from './files';
import { config } from '../../config';
import { wrapListGetter } from '../../utils';

function fixMovie(movie: Movie): MovieSchema {
  let movieSchema: MovieSchema = movie as MovieSchema;

  if (movie.bannerPath)
    movieSchema.bannerUrl = getImageUrl(movie.bannerPath);
    
  if (movie.thumbnailPath)
    movieSchema.thumbnailUrl = getImageUrl(movie.thumbnailPath);

  return movieSchema;
}

export async function getMovies(): Promise<readonly MovieSchema[]> {
  let movies: readonly Movie[];

  try {
    movies = await m.getMovies();
  } catch {
    return [];
  }

  return movies.map(x => fixMovie(x));
}

export const getScreeningsByMovie = wrapListGetter(m.getScreeningsByMovie);

export function getImageUrl(hash: string): string {
  return `${config.baseUrl}/u/${hash}`;
}

export async function getMovie(id: UUID): Promise<[Result, MovieSchema | null]> {
  const movie = await m.getMovie(id);

  if (!movie)
    return [Result.ErrorMovieNotFound, null];

    return [Result.Ok, fixMovie(movie)];
}

export async function deleteMovie(id: UUID) {
  const movie = await m.deleteMovie(id);

  if (!movie) return;

  if (movie.thumbnailPath)
    await deleteImageFromDisk(movie.thumbnailPath);

  if (movie.bannerPath)
    await deleteImageFromDisk(movie.bannerPath);
}

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

export async function uploadImage(id: UUID, imgType: ImageType, imgData: string): Promise<[Result, string | null]> {
  const imageHash = await saveImage(imgData);

  await match(imgType)
    .with('banner', async () => m.updateBanner(id, imageHash))
    .with('thumbnail', async () => m.updateThumbnail(id, imageHash))
    .run();

  return [Result.Ok, imageHash];
}

async function deleteImageFromDisk(hash: string) {
  // delete image from disk if no movies refer to it
  const count = await m.imageUseCount(hash);

  if (count <= 0) {
    await f.deleteImage(hash);
  }
}

export async function deleteImage(id: UUID, imgType: ImageType): Promise<Result> {
  const img = await getImage(id, imgType);

  if (img[0] != Result.Ok)
    return img[0];

  await match(imgType)
    .with('banner', async () => m.updateBanner(id, null))
    .with('thumbnail', async () => m.updateThumbnail(id, null))
    .run();
   
  await deleteImageFromDisk(img[1]!);

  return Result.Ok;
}
