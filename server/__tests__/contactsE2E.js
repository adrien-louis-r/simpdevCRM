const { createTestClient } = require('apollo-server-testing');
const knexCleaner = require('knex-cleaner');
const server = require('../src/makeApolloServer');
const db = require('../src/db');
const {
  GET_CONTACT,
  GET_CONTACT_LIST,
  ADD_CONTACT,
  UPDATE_CONTACT,
  REMOVE_CONTACT,
} = require('./__queries__/contacts');

const MOCK_UUID_VALUE = '36c66dc4-7fa6-42dc-9b34-85b1a4d5b127';

jest.mock('uuid', () => ({ v4: () => MOCK_UUID_VALUE }));

const { query, mutate } = createTestClient(server);

afterEach(async () => {
  await knexCleaner.clean(db, {
    ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
  });
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('Create', () => {
  test('valid data', async () => {
    const res = await mutate({
      mutation: ADD_CONTACT,
      variables: {
        contact: {
          relationshipId: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
          email: 'foo.bar@example.com',
          firstname: 'foo',
          lastname: 'bar',
        },
      },
    });

    expect(res.data).toEqual({
      addContact: {
        id: MOCK_UUID_VALUE,
        email: 'foo.bar@example.com',
        firstname: 'foo',
        lastname: 'bar',
        relationship: {
          id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
          name: 'Promising contact',
          type: 'prospect',
        },
      },
    });
  });

  test('bad user input', async () => {
    const res = await mutate({
      mutation: ADD_CONTACT,
      variables: {
        contact: {
          email: 'foo.bar@example',
          firstname: 'f',
          lastname: 'b',
        },
      },
    });

    expect(res.data).toEqual({
      addContact: {
        errors: [
          {
            field: 'email',
            message: '"email" must be a valid email',
          },
          {
            field: 'firstname',
            message: '"firstname" length must be at least 2 characters long',
          },
          {
            field: 'lastname',
            message: '"lastname" length must be at least 2 characters long',
          },
        ],
      },
    });
  });
});

describe('Update', () => {
  test('valid data', async () => {
    const res = await mutate({
      mutation: UPDATE_CONTACT,
      variables: {
        id: 'e64c1b18-7b70-4a76-b733-250abb6238d8',
        contact: {
          relationshipId: 'e7ce879c-bfdd-4126-b222-9cd5efdba701',
          email: 'june.dore@example.com',
          firstname: 'june',
          lastname: 'dore',
        },
      },
    });

    expect(res.data).toEqual({
      updateContact: {
        id: 'e64c1b18-7b70-4a76-b733-250abb6238d8',
        email: 'june.dore@example.com',
        firstname: 'june',
        lastname: 'dore',
        relationship: {
          id: 'e7ce879c-bfdd-4126-b222-9cd5efdba701',
          name: 'Friendly freelance',
          type: 'business',
        },
      },
    });
  });

  test('bad user input', async () => {
    const res = await mutate({
      mutation: UPDATE_CONTACT,
      variables: {
        id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
        contact: {
          email: 'june.dore@example',
          firstname: 'j',
          lastname: 'd',
        },
      },
    });

    expect(res.data).toEqual({
      updateContact: {
        errors: [
          {
            field: 'email',
            message: '"email" must be a valid email',
          },
          {
            field: 'firstname',
            message: '"firstname" length must be at least 2 characters long',
          },
          {
            field: 'lastname',
            message: '"lastname" length must be at least 2 characters long',
          },
        ],
      },
    });
  });

  test('invalid input', async () => {
    const res = await mutate({
      mutation: UPDATE_CONTACT,
      variables: {
        id: 'missing-relationship',
        contact: {
          relationshipId: 'e7ce879c-bfdd-4126-b222-9cd5efdba701',
          email: 'june.dore@example.com',
          firstname: 'june',
          lastname: 'dore',
        },
      },
    });

    expect(res.data).toEqual({
      updateContact: {
        message: 'The contact with the id "missing-relationship" does not exist.',
      },
    });
  });

  test('no such entity', async () => {
    const res = await mutate({
      mutation: UPDATE_CONTACT,
      variables: {
        id: '11111111-2222-3333-4444-555555555555',
        contact: {
          relationshipId: 'e7ce879c-bfdd-4126-b222-9cd5efdba701',
          email: 'june.dore@example.com',
          firstname: 'june',
          lastname: 'dore',
        },
      },
    });

    expect(res.data).toEqual({
      updateContact: {
        message: 'The contact with the id "11111111-2222-3333-4444-555555555555" does not exist.',
      },
    });
  });
});

describe('List', () => {
  test('all', async () => {
    const res = await query({ query: GET_CONTACT_LIST });

    expect(res.data).toEqual({
      contactList: {
        total: 3,
        items: [
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
          {
            email: 'GoodAcme@example.com',
            firstname: 'Good',
            id: 'e64c1b18-7b70-4a76-b733-250abb6238d8',
            lastname: 'Acme',
          },
        ],
      },
    });
  });

  test('with size', async () => {
    const res = await query({ query: GET_CONTACT_LIST, variables: { params: { size: 2 } } });

    expect(res.data).toEqual({
      contactList: {
        total: 3,
        items: [
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
      },
    });
  });

  test('with size and from', async () => {
    const res = await query({
      query: GET_CONTACT_LIST,
      variables: { params: { size: 2, from: 1 } },
    });

    expect(res.data).toEqual({
      contactList: {
        total: 3,
        items: [
          {
            id: '5f51285e-c510-436b-b06c-a16bec51a92c',
            email: 'John.Doe@example.com',
            firstname: 'John',
            lastname: 'Doe',
          },
          {
            email: 'GoodAcme@example.com',
            firstname: 'Good',
            id: 'e64c1b18-7b70-4a76-b733-250abb6238d8',
            lastname: 'Acme',
          },
        ],
      },
    });
  });
});

describe('Get', () => {
  test('valid id', async () => {
    const res = await query({
      query: GET_CONTACT,
      variables: { id: '945641cc-f972-4bdc-b7b4-ad449739c0e9' },
    });

    expect(res.data).toEqual({
      contact: {
        email: 'jane.doe@example.com',
        firstname: 'Jane',
        id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
        lastname: 'Doe',
      },
    });
  });

  test('invalid input', async () => {
    const res = await query({
      query: GET_CONTACT,
      variables: { id: 'missing-contact' },
    });

    expect(res.data).toEqual({
      contact: {
        message: 'The contact with the id "missing-contact" does not exist.',
      },
    });
  });

  test('no such entity', async () => {
    const res = await query({
      query: GET_CONTACT,
      variables: { id: '11111111-2222-3333-4444-555555555555' },
    });

    expect(res.data).toEqual({
      contact: {
        message: 'The contact with the id "11111111-2222-3333-4444-555555555555" does not exist.',
      },
    });
  });
});

describe('Delete', () => {
  test('valid id', async () => {
    const res = await query({
      query: REMOVE_CONTACT,
      variables: { id: '945641cc-f972-4bdc-b7b4-ad449739c0e9' },
    });

    expect(res.data).toEqual({
      removeContact: {
        id: '945641cc-f972-4bdc-b7b4-ad449739c0e9',
        success: true,
      },
    });
  });

  test('invalid input', async () => {
    const res = await query({
      query: REMOVE_CONTACT,
      variables: { id: 'missing-contact' },
    });

    expect(res.data).toEqual({
      removeContact: {
        message: 'The contact with the id "missing-contact" does not exist.',
      },
    });
  });

  test('not such entity', async () => {
    const res = await query({
      query: REMOVE_CONTACT,
      variables: { id: '945641cc-f972-4bdc-b7b4-ad449739c0e8' },
    });

    expect(res.data).toEqual({
      removeContact: {
        message: 'The contact with the id "945641cc-f972-4bdc-b7b4-ad449739c0e8" does not exist.',
      },
    });
  });
});
