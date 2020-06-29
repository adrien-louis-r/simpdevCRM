const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const customer = require('./customer/index');

const indexRouter = require('./pages/index');

const server = new ApolloServer({ schema: buildFederatedSchema(customer) });

const app = express();
server.applyMiddleware({ app });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
