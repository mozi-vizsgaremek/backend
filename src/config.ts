import dotenv from 'dotenv';
dotenv.config();

export type Config = {
    port: number,
    postgresConnectionString: string,
    jwtSecret: string,
    jwtIssuer: string,
    accessTokenExpiration: number, // stored in seconds
    refreshTokenExpiration: number // ditto
}

function readVal<T>(key: string, caster: (x: string) => T, fallback: T|undefined = undefined): T {
    if (!(key in process.env))
        if (fallback == undefined)
            throw new Error(`Configuration key '${key}' not found in process environment.`); // halt and catch fire
        else {
            console.log(`Using fallback value for configuration key '${key}'`);
            return fallback;
        }

    return caster(process.env[key]!);
}

export const config: Config = {
    port: readVal('PORT', Number, 8080),
    postgresConnectionString: readVal('POSTGRES_CONN_STR', String),
    jwtSecret: readVal('JWT_SECRET', String),
    accessTokenExpiration: readVal('ACCESS_TOKEN_EXPIRATION', Number, 525960) * 60, // convert minutes to seconds
    refreshTokenExpiration: readVal('REFRESH_TOKEN_EXPIRATION', Number, 5) * 60,
    jwtIssuer: readVal('JWT_ISSUER', String, 'MoziBackend')
}
