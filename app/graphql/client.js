import {ApolloClient, InMemoryCache} from '@apollo/client';
import {HttpLink} from 'apollo-link-http';

export default new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        //credentials: 'same-origin',
        uri: 'https://846217303170.ngrok.io/api/graphql'
    })
});
