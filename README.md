## Running database in development environments

```bash
docker run -p 5432:5432 -e POSTGRES_USER=vizsgaremek -e POSTGRES_PASSWORD=vizsgaremek -d --name postgres postgres:15.1
```

## Database migrations

We use Flyway CLI (the GUI version barely works) to generate and run migrations.

### Creating a new migration

Please refer to the [Flyway documentation](https://flywaydb.org/documentation/concepts/migrations)

### Running migrations

Assuming your database uses the default credentials provided in the docker command above, this will run all of the migrations.

TODO: create a javascript wrapper around this command, that reads the config file automatically

```bash
docker run --network=host -v $PWD/migrations:/sql flyway/flyway:9.8.1 -user=vizsgaremek -password=vizsgaremek -url="jdbc:postgresql://localhost:5432/vizsgaremek" -locations=filesystem:/sql migrate
```