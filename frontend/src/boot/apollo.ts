import { boot } from 'quasar/wrappers';
import {
  InMemoryCache,
  from,
  ApolloClient,
  type FetchPolicy,
  type ErrorPolicy,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink, } from '@apollo/client/link/http';
import { ApolloClients, provideApolloClient } from '@vue/apollo-composable';

// Create the http link
const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URI || (window.location.href.indexOf("localhost") > 0 ? 'https://localhost:5001/graphql' : getGQLBackendUrl())
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-API-KEY': `rabonaPod`,
    }
  };
});


// Function to get client options
function getClientOptions() {
  return {
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network' as FetchPolicy,
        errorPolicy: 'all' as ErrorPolicy,
      },
      query: {
        fetchPolicy: 'network-only' as FetchPolicy,
        errorPolicy: 'all' as ErrorPolicy,
      },
    },
  };
}

export default boot(({ app }) => {
  const options = getClientOptions();
  const apolloClient = new ApolloClient(options);

  const apolloClients: Record<string, ApolloClient<unknown>> = {
    default: apolloClient,
  };
  provideApolloClient(apolloClient);

  app.provide(ApolloClients, apolloClients);
});

export function getGQLBackendUrl() {
  return getBackendUrl() + '/graphql';
}

export function getBackendUrl() {
  const currentUrl = new URL(window.location.href);
  const protocol = currentUrl.protocol;
  const hostname = currentUrl.hostname;
  const port = currentUrl.port;
  return `${protocol}//${hostname}:${port}`;
}
