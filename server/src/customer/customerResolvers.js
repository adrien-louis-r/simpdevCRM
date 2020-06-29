const model = require('./customerModel');

const resolvers = {
  Query: {
    customerList: () => model.all(),
    customer: (_, { id }) => model.find(id),
  },
  Mutation: {
    addCustomer: (_, { customer }) => model.create(customer),
    updateCustomer: (_, { id, customer }) => model.update(id, customer),
  },
};

module.exports = resolvers;
