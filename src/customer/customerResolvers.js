const customers = require('./customerModel');

const resolvers = {
  Query: {
    customerList: () => customers.all(),
    customer: (_, { id }) => customers.find(id),
  },
};

module.exports = resolvers;
