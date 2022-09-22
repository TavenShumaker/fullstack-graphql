import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */


const typeDefs = gql`
  extend type User {
    age: Int
  }
`

const reslovers = {
  User: {
    age: () => 35
  }
}

const http = new HttpLink({
  uri: 'http://localhost:4000/'
});

const delay = setContext(
  request =>
    new Promise((success, fail) => {
      setTimeout(() => {
        success()
      }, 800)
    })
)

const link = ApolloLink.from([
  delay,
  http
])

/**
 * The InMemoryCache is built into apollo client, but it can be easily extended
 */
const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  reslovers
});

export default client;