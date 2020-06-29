const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const knexCleaner = require('knex-cleaner');
const customer = require('../src/customer/index');
const db = require('../src/db');

const MOCK_UUID_VALUE = '36c66dc4-7fa6-42dc-9b34-85b1a4d5b127';

const GET_CUSTOMER_LIST = gql`
  {
    customerList {
      id
      email
      lastname
      firstname
    }
  }
`;

const GET_CUSTOMER = gql`
  query customer($id: ID!) {
    customer(id: $id) {
      id
      email
      lastname
      firstname
    }
  }
`;

const ADD_CUSTOMER = gql`
  mutation addCustomer($customer: CustomerInput!) {
    addCustomer(customer: $customer) {
      id
      email
      lastname
      firstname
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($id: ID!, $customer: CustomerInput!) {
    updateCustomer(id: $id, customer: $customer) {
      id
      email
      lastname
      firstname
    }
  }
`;

jest.mock('uuid', () => ({ v4: () => MOCK_UUID_VALUE }));

afterEach(async () => {
  await knexCleaner.clean(db, {
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  });
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('Customers', () => {
  const server = new ApolloServer(customer);
  const { query, mutate } = createTestClient(server);

  test('create', async () => {
    const res = await mutate({
      mutation: ADD_CUSTOMER,
      variables: {
        customer: {
          email: 'foo.bar@example.com',
          firstname: 'foo',
          lastname: 'bar',
        },
      },
    });

    expect(res.data).toEqual({
      addCustomer: {
        id: MOCK_UUID_VALUE,
        email: 'foo.bar@example.com',
        firstname: 'foo',
        lastname: 'bar',
      },
    });
  });

  test('update', async () => {
    const res = await mutate({
      mutation: UPDATE_CUSTOMER,
      variables: {
        id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
        customer: {
          email: 'june.dore@example.com',
          firstname: 'june',
          lastname: 'dore',
        },
      },
    });

    expect(res.data).toEqual({
      updateCustomer: {
        id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
        email: 'june.dore@example.com',
        firstname: 'june',
        lastname: 'dore',
      },
    });
  });

  test('get list', async () => {
    const res = await query({ query: GET_CUSTOMER_LIST });
    expect(res.data).toEqual({
      customerList: [
        {
          id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
          email: 'jane.doe@example.com',
          firstname: 'Jane',
          lastname: 'Doe',
        },
        {
          id: '5f51285e-c510-436b-b06c-a16bec51a92c',
          email: 'John.Doe@example.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      ],
    });
  });

  test('get by id', async () => {
    const res = await query({
      query: GET_CUSTOMER,
      variables: { id: '945641cc-f972-4bdc-b7b4-ad449739c0e9' },
    });
    expect(res.data).toEqual({
      customer: {
        email: 'jane.doe@example.com',
        firstname: 'Jane',
        id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
        lastname: 'Doe',
      },
    });
  });

  test('get by id for non existing customer', async () => {
    const res = await query({
      query: GET_CUSTOMER,
      variables: { id: 'missing-customer' },
    });
    expect(res.data).toBe(null);
  });
});
