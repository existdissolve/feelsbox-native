import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native-paper';
import {Text, View} from 'react-native';

import Navbar from '-/components/Navbar';
import Categories from '-/components/category';
import Devices from '-/components/device';
import History from '-/components/device/History';
import DeviceForm from '-/components/device/Form';
import DeviceGroups from '-/components/device/group';
import DeviceGroupForm from '-/components/device/group/Form';
import Account from '-/components/account';
import Feels from '-/components/feel';

const HomeScreen = props => {
    const {navigation} = props;

    return (
        <View style={{flex: 1}}>
            <Text>Home Hello</Text>
            <Button title="Go to Next" onPress={() => navigation.navigate('next')} />
        </View>
    );
};

export default () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="feels" screenOptions={{header: Navbar}}>
            <Stack.Screen name="home" component={HomeScreen} options={{title: 'Home'}} />
            <Stack.Screen name="feels" component={Feels} options={{title: 'My Feels', animationEnabled: false}} />
            <Stack.Screen name="categories" component={Categories} options={{title: 'Categories', animationEnabled: false}} />
            <Stack.Screen name="devices" component={Devices} options={{title: 'Devices', animationEnabled: false}} />
            <Stack.Screen name="devicehistory" component={History} options={{title: 'Devices', animationEnabled: false}} />
            <Stack.Screen name="editdevice" component={DeviceForm} options={{title: 'Edit Device', animationEnabled: false}} />
            <Stack.Screen name="devicegroups" component={DeviceGroups} options={{title: 'My Device Groups', animationEnabled: false}} />
            <Stack.Screen name="editdevicegroup" component={DeviceGroupForm} options={{title: 'Edit Device Group', animationEnabled: false}} />
            <Stack.Screen name="account" component={Account} options={{title: 'My Account', animationEnabled: false}} />
        </Stack.Navigator>
    );
};
