import { config as loadEnv } from 'dotenv';
import { match, P } from 'ts-pattern';
loadEnv();

export type EnvVals = 'dev'|'prod';

export type Config = {
  port: number,
  postgresConnectionString: string,
  jwtSecret: string,
  jwtIssuer: string,
  env: EnvVals,
  accessTokenExpiration: number, // stored in seconds
  refreshTokenExpiration: number, // ditto
  uploadDirectory: string
}

function readVal<T>(key: string, caster: (x: string) => T, fallback: T | undefined = undefined): T {
  if (!(key in process.env))
    if (fallback == undefined)
      throw new Error(`Configuration key '${key}' not found in process environment.`); // halt and catch fire
    else {
      console.log(`Using fallback value for configuration key '${key}'`);
      return fallback;
    }

  return caster(process.env[key]!);
}

function envCaster(val: string): EnvVals {
  return match(val)
    .with(P.union('dev', 'prod'), () => val)
    .with(P._, () => 'prod')
    .run() as EnvVals;
}

export const config: Config = {
  port: readVal('PORT', Number, 8080),
  postgresConnectionString: readVal('POSTGRES_CONN_STR', String),
  jwtSecret: readVal('JWT_SECRET', String),
  jwtIssuer: readVal('JWT_ISSUER', String, 'MoziBackend'),
  env: readVal('ENV', envCaster, 'prod'),
  accessTokenExpiration: readVal('ACCESS_TOKEN_EXPIRATION', Number, 525960) * 60, // convert minutes to seconds
  refreshTokenExpiration: readVal('REFRESH_TOKEN_EXPIRATION', Number, 5) * 60,
  uploadDirectory: readVal('UPLOAD_DIRECTORY', String)
}
