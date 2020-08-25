import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import "./dist/styles/main.css";
import { BrowserRouter } from "react-router-dom";
import possibleTypes from "./dist/possibleTypes.json";
import Layout from "./Layout";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  uri: "http://localhost:4100/graphql",
  cache: new InMemoryCache({
    possibleTypes,
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
