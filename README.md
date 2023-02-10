# Mozi Backend

TODO: introductions and etc

# Setup

## Starting the database

This is mainly meant for development setups.

TODO: production docker compose file

```bash
docker run -p 5432:5432 -e POSTGRES_USER=vizsgaremek -e POSTGRES_PASSWORD=vizsgaremek -d --name postgres postgres:15.1
```

## Migrations

We use Flyway CLI to run migrations. The migrations themselves are hand-written.

For more formation, please refer to the [Flyway documentation](https://flywaydb.org/documentation/concepts/migrations)

### Running migrations

Assuming your database uses the default credentials provided in the docker command above, this will run all of the migrations.

TODO: create a javascript wrapper around this command, that reads the config file automatically

```bash
docker run --network=host -v $PWD/migrations:/sql --rm flyway/flyway:9.8.1 -user=vizsgaremek -password=vizsgaremek -url="jdbc:postgresql://localhost:5432/vizsgaremek" -locations=filesystem:/sql migrate
```

## Installing dependencies

To install the required dependencies, use your preferred npm tool (npm, pnpm, yarn). For example

``` bash
npm install
```

## Configuring 

The backend is configured using .env files, an example is provided in the project root. The example values should work on development environments out of the box.

TODO: config value docs

## Running

For automatic reloading, the following should be run (in separate terminals):

``` bash
npm run watch
npm run nodemon 
```

### Running in production

Production deployments should use the provided Dockerfile. Alternatively, `npm run start` will start the compiled version.
