# simpdevCRM

A simple CRM for my needs (contact management / quote / invoice).

## Tech stack

- Node.js
- React
- PostgreSQL
- Tailwindcss

## Requirements

Node.js >= 12
npm
PostgreSQL >= 12

### Postgres with Docker

To install PostgreSQL with docker: (I use custom volumes to manage postgres version, it is not mandatory):

```
 docker run -d \
    --name postgres13.0 \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=password \
    -v /home/adrien/Data/postgres/13.0:/var/lib/postgresql/data \
    postgres:13.0
```

## Installation

### Server side

Go to the server folder

```
cd server
```

Create a `crm_test` and `crm_dev` on your Postgres instance and copy the default knexfile

- Connect to your Postgres instance (here using docker)

```
docker exec -ti postgres13.0 psql -U postgres
```

- Create the needed DB

```
CREATE DATABASE crm_test;
CREATE DATABASE crm_dev;
```

- Create the knexfile for DB configuration and update it with your access

```
cp knexfile.js.example knexfile.js
```

- Install the JS dependencies

```
npm i
```

- If needed, install the seed data

```
npm run seed:dev
```

- Start the dev environment

```
npm start
```

### Server side

- Go to the client folder

```
cd client
```

- Install JS dependencies

```
npm i
```

- Start the dev environment

```
npm start
```

## Tests

### Server side

To lauch tests on the server:

```
cd server
npm run seed:test
npm test
```

You can use watch mode:

```
npm run test:watch
```

### Client

For now, there is no tests here ¯\_(ツ)\_/¯

## Roadmap

TODO :)
