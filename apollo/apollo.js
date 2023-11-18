import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-celo-mainnet',
  cache: new InMemoryCache(),
});

export default client;
