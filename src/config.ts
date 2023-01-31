import dotenv from 'dotenv';

dotenv.config();

export type Config = {
    port: number
}

function readVal<T>(key: keyof Config, caster: (x: string) => T, fallback: T|undefined): T {
    if (!(key in process.env))
        if (fallback == undefined)
            throw new Error(`Configuration key '${key}' not found in process environment.`); // halt and catch fire
        else return fallback;

    return caster(process.env[key]!);
}

export const config: Config = {
    port: readVal('port', Number, 8080)
}
