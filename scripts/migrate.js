require('dotenv').config();

const { SlonikMigrator } = require('@slonik/migrator')
const { createPool } = require('slonik')

async function migrate() {
    const slonik = await createPool(process.env['POSTGRES_CONN_STR'] 
                                    ?? 'postgresql://postgres:postgres@localhost:5433/postgres');

    const migrator = new SlonikMigrator({
        migrationsPath: __dirname + '/../migrations',
        migrationTableName: 'migration',
        slonik,
        logger: console
    });  

    migrator.runAsCLI()
}

migrate();