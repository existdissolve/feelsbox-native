import {ApolloClient, InMemoryCache} from '@apollo/client';
import {HttpLink} from 'apollo-link-http';

export default new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        credentials: 'same-origin',
        uri: 'https://ca837cacc6f0.ngrok.io/api/graphql'
    })
});
