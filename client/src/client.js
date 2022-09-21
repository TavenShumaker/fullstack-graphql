import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */


const link = new HttpLink({
  uri: 'http://localhost:4000/'
});

/**
 * The InMemoryCache is built into apollo client, but it can be easily extended
 */
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

export default client;