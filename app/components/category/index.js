import React from 'react';
import {useQuery} from '@apollo/client';
import {Text, View} from 'react-native';

import {getMyCategories} from '-/graphql/category';

export default props => {
    const results = useQuery(getMyCategories, {
        options: {notifyOnNetworkStatusChange: true}
    });
    console.log(results);

    return (
        <View>
            <Text>Categories!</Text>
        </View>
    );
};
