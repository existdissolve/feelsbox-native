import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native-paper';
import {Text, View} from 'react-native';

import Navbar from '-/components/Navbar';
import Categories from '-/components/category';
import Devices from '-/components/device';

const HomeScreen = props => {
    const {navigation} = props;

    return (
        <View style={{flex: 1}}>
            <Text>Home Hello</Text>
            <Button title="Go to Next" onPress={() => navigation.navigate('next')} />
        </View>
    );
};

const NextScreen = () => {
    return (
        <View>
            <Text>Next Screen</Text>
        </View>
    );
};

export default () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="devices" screenOptions={{header: Navbar}}>
            <Stack.Screen name="home" component={HomeScreen} options={{title: 'Home'}} />
            <Stack.Screen name="categories" component={Categories} options={{title: 'Categories', animationEnabled: false}} />
            <Stack.Screen name="devices" component={Devices} options={{title: 'Devices', animationEnabled: false}} />
            <Stack.Screen name="next" component={NextScreen} options={{title: 'Next Thing'}} />
        </Stack.Navigator>
    );
};
