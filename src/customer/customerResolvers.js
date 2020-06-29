const customerRepository = require('./customerRepository');

const resolvers = {
  Query: {
    customerList: () => customerRepository.all(),
    customer: (_, { id }) => customerRepository.find(id),
  },
  Mutation: {
    addCustomer: (_, { customer }) => customerRepository.create(customer),
    updateCustomer: (_, { id, customer }) => customerRepository.update(id, customer),
  },
};

module.exports = resolvers;
