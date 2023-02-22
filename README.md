# Mozi Backend

TODO: introductions and etc

# Setup

## Starting the database

This is mainly meant for development setups.

The included docker compose manifest can be used to quickly set up the backend (along with the database) in production environments (but the default config values are not suitable for anything other than development and staging deployments). The migrations need to be executed manually (see below).

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

An example of all available environment variables can be found in .env.example

### Variables

- POSTGRES_CONN_STR: Used by slonik to create a new connection pool to the database
- POSTGRES_PORT: Only used by the compose file, this is the external port the container publishes.
- JWT_SECRET: The JWT signing secret used for both the refresh and access tokens.
- JWT_ISSUER: Arbitrary string, the value of the `iss` field in both types of JWT tokens. Changing this between deployments invalidates JWT tokens with mismatching issuer fields.
- REFRESH_TOKEN_EXPIRATION: The time-to-live of the refresh token in minutes, defaults to a year.
- ACCESS_TOKEN_EXPIRATION: The time-to-live of the access token in minutes, defaults to 5 minutes.
- PORT: The listening port of the backend. The docker compose overrides this to 8080, but still publishes it to the given port.

## Running

For automatic reloading, the following should be run (in separate terminals):

``` bash
npm run watch
npm run nodemon 
```

### Running in production

Production deployments should use the provided Dockerfile. Alternatively, `npm run start` will start the compiled version.

## Authenticating against the backend

The current system is very simple. It mimicks the way Auth0's refresh/access token method works, with a much simpler implementation. The frontend first has to log in (`POST /auth/login`), and save both tokens. The access token expires in 5 minutes (by default), then the frontend must 'refresh' it (`POST /auth/refresh`), which will return a new access token. The access token includes most information required by the backend, which enables us to skip a round-trip to the database at the beginning of every request's lifecycle.