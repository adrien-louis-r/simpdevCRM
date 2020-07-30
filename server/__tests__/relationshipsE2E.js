const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const knexCleaner = require('knex-cleaner');
const server = require('../src/makeApolloServer');
const db = require('../src/db');

const MOCK_UUID_VALUE = '36c66dc4-7fa6-42dc-9b34-85b1a4d5b127';

const NOT_FOUND_FRAGMENT = gql`
  fragment NotFoundMessage on NotFoundEntity {
    message
  }
`;

const INVALID_PARAM_FRAGMENT = gql`
  fragment InvalidParamMessage on InvalidParam {
    message
  }
`;

const BAD_USER_INPUT_FRAGMENT = gql`
  fragment BadUserInput on BadUserInput {
    errors {
      field
      message
    }
  }
`;

const RELATIONSHIP_FRAGMENT = gql`
  fragment RelationshipData on Relationship {
    id
    name
    type
  }
`;

const GET_RELATIONSHIP_LIST = gql`
  {
    relationshipList {
      ...RelationshipData
    }
  }
  ${RELATIONSHIP_FRAGMENT}
`;

const GET_RELATIONSHIP = gql`
  query relationship($id: ID!) {
    relationship(id: $id) {
      ...RelationshipData
      ...NotFoundMessage
      ...InvalidParamMessage
    }
  }
  ${RELATIONSHIP_FRAGMENT}
  ${NOT_FOUND_FRAGMENT}
  ${INVALID_PARAM_FRAGMENT}
`;

const ADD_RELATIONSHIP = gql`
  mutation addRelationship($relationship: RelationshipInput!) {
    addRelationship(relationship: $relationship) {
      ...RelationshipData
      ...BadUserInput
    }
  }
  ${RELATIONSHIP_FRAGMENT}
  ${BAD_USER_INPUT_FRAGMENT}
`;

const UPDATE_RELATIONSHIP = gql`
  mutation updateRelationship($id: ID!, $relationship: RelationshipInput!) {
    updateRelationship(id: $id, relationship: $relationship) {
      ...RelationshipData
      ...BadUserInput
    }
  }
  ${RELATIONSHIP_FRAGMENT}
  ${BAD_USER_INPUT_FRAGMENT}
`;

const REMOVE_RELATIONSHIP = gql`
  mutation removeRelationship($id: ID!) {
    removeRelationship(id: $id) {
      id
      success
    }
  }
`;

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
      mutation: ADD_RELATIONSHIP,
      variables: {
        relationship: {
          name: 'My new customer!',
          type: 'customer',
        },
      },
    });

    expect(res.data).toEqual({
      addRelationship: {
        id: MOCK_UUID_VALUE,
        name: 'My new customer!',
        type: 'customer',
      },
    });
  });

  test('bad user input', async () => {
    const res = await mutate({
      mutation: ADD_RELATIONSHIP,
      variables: {
        relationship: {
          name: '!',
          type: '¯\\_(ツ)_/¯',
        },
      },
    });

    expect(res.data).toEqual({
      addRelationship: {
        errors: [
          {
            field: 'name',
            message: '"name" length must be at least 2 characters long',
          },
          {
            field: 'type',
            message: '"type" must be one of [business, prospect, customer]',
          },
        ],
      },
    });
  });
});

describe('Update', () => {
  test('valid data', async () => {
    const res = await mutate({
      mutation: UPDATE_RELATIONSHIP,
      variables: {
        id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
        relationship: {
          name: 'Promising customer :)',
          type: 'customer',
        },
      },
    });

    expect(res.data).toEqual({
      updateRelationship: {
        id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
        name: 'Promising customer :)',
        type: 'customer',
      },
    });
  });

  test('bad user input', async () => {
    const res = await mutate({
      mutation: UPDATE_RELATIONSHIP,
      variables: {
        id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
        relationship: {
          name: '!',
          type: '¯\\_(ツ)_/¯',
        },
      },
    });

    expect(res.data).toEqual({
      updateRelationship: {
        errors: [
          {
            field: 'name',
            message: '"name" length must be at least 2 characters long',
          },
          {
            field: 'type',
            message: '"type" must be one of [business, prospect, customer]',
          },
        ],
      },
    });
  });
});

describe('List', () => {
  test('all', async () => {
    const res = await query({ query: GET_RELATIONSHIP_LIST });
    expect(res.data).toEqual({
      relationshipList: [
        {
          id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
          name: 'Promising contact',
          type: 'prospect',
        },
        {
          id: 'dbd4666a-92df-47b5-82d3-9163c4875db9',
          name: 'Nice customer',
          type: 'customer',
        },
        {
          id: 'e7ce879c-bfdd-4126-b222-9cd5efdba701',
          name: 'Friendly freelance',
          type: 'business',
        },
      ],
    });
  });
});

describe('Get', () => {
  test('valid id', async () => {
    const res = await query({
      query: GET_RELATIONSHIP,
      variables: { id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e' },
    });

    expect(res.data).toEqual({
      relationship: {
        id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
        name: 'Promising contact',
        type: 'prospect',
      },
    });
  });

  test('invalid input', async () => {
    const res = await query({
      query: GET_RELATIONSHIP,
      variables: { id: 'missing-relationship' },
    });

    expect(res.data).toEqual({
      relationship: {
        message: 'The relationship with the id "missing-relationship" does not exist.',
      },
    });
  });

  test('no such entity', async () => {
    const res = await query({
      query: GET_RELATIONSHIP,
      variables: { id: '11111111-2222-3333-4444-555555555555' },
    });

    expect(res.data).toEqual({
      relationship: {
        message:
          'The relationship with the id "11111111-2222-3333-4444-555555555555" does not exist.',
      },
    });
  });
});

describe('Delete', () => {
  test('valid id', async () => {
    const res = await query({
      query: REMOVE_RELATIONSHIP,
      variables: { id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e' },
    });

    expect(res.data).toEqual({
      removeRelationship: {
        id: '4d1b5024-e42d-4274-a7c8-d0e979ec9e0e',
        success: true,
      },
    });
  });
});
