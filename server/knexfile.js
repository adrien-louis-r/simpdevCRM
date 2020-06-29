module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'crm_test',
    },
    seeds: {
      directory: './db/seeds',
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'crm',
    },
    seeds: {
      directory: './db/seeds',
    },
    migrations: {
      directory: './db/migrations',
    },
  },
};
