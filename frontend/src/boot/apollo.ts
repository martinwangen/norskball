import { boot } from 'quasar/wrappers';
import {
  InMemoryCache,
  ApolloClient,
  createHttpLink,
  from,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloClients, provideApolloClient } from '@vue/apollo-composable';
import { useAuthStore } from '../stores/auth';

// Create the http link
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'https://localhost:5001/graphql',
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
});

// Add the auth link
const authLink = setContext((_, { headers }) => {
  const authStore = useAuthStore();
  const token = authStore.getToken();
  console.log('Apollo client using token:', token);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`
      );

      // Handle authentication errors
      if (message.includes('The current user is not authorized')) {
        console.error('Authentication error - token may be invalid or expired');
        const authStore = useAuthStore();
        void authStore.checkAuth().catch(error => {
          console.error('Error checking auth:', error);
        });
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export { apolloClient };

// Boot function for Quasar
export default boot(({ app }) => {
  app.provide(ApolloClients, {
    default: apolloClient,
  });
  provideApolloClient(apolloClient);
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
