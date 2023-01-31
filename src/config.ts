import dotenv from 'dotenv';
dotenv.config();

export type Config = {
    port: number
}

function readVal<T>(key: keyof Config, caster: (x: string) => T, fallback: T|undefined): T {
    const nkey: string = key.toUpperCase();

    if (!(nkey in process.env))
        if (fallback == undefined)
            throw new Error(`Configuration key '${nkey}' not found in process environment.`); // halt and catch fire
        else {
            console.log(`Using fallback value for configuration key '${nkey}'`);
            return fallback;
        }

    return caster(process.env[nkey]!);
}

export const config: Config = {
    port: readVal('port', Number, 8080)
}
