const request = require('supertest');
const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const app = require('../src/app');
const customer = require('../src/customer/index');
const db = require('../src/db');

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

afterAll(async () => {
  await db.destroy();
});

describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test customers', () => {
  const server = new ApolloServer(customer);
  const { query } = createTestClient(server);

  test('customerList', async () => {
    const res = await query({ query: GET_CUSTOMER_LIST });
    expect(res.data).toEqual({
      customerList: [
        {
          email: 'jane.doe@example.com',
          firstname: 'Jane',
          id: '1',
          lastname: 'Doe',
        },
        {
          email: 'John.Doe@example.com',
          firstname: 'John',
          id: '2',
          lastname: 'Doe',
        },
      ],
    });
  });

  test('customer', async () => {
    const res = await query({ query: GET_CUSTOMER, variables: { id: 1 } });
    expect(res.data).toEqual({
      customer: {
        email: 'jane.doe@example.com',
        firstname: 'Jane',
        id: '1',
        lastname: 'Doe',
      },
    });
  });
});
