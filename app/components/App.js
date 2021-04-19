import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import {Provider as PaperProvider, Appbar, Drawer} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import {Button} from 'react-native-paper';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'base-64';
import {get} from 'lodash';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import Authentication from '-/components/Authentication';
import SnackbarProvider from '-/components/shared/Snackbar';
import Categories from '-/components/category';
/*
let ble;

const deviceFound = async(err, device) => {
    if (err) {
        console.log('error', err);
    } else if (device && device.name && device.name.toUpperCase() === 'FEELSBOXER') {
        const {id} = device;

        ble.stopDeviceScan();
        console.log('trying to connect...')
        const connectedDevice = await ble.connectToDevice(id);

        console.log('FEELSBOX connected')
        console.log(connectedDevice)
        //await device.discoverAllServicesAndCharacteristics();
        console.log('writing request')
        const isConnected = await ble.isDeviceConnected(id);
        //const services = await ble.servicesForDevice(id);
        console.log('isConnected', isConnected);
        const populatedDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
        const services = await populatedDevice.services();
        console.log(services.map(service => service.uuid))
        const char = await ble.characteristicsForDevice(id, '6614b052-0c97-44ae-a417-fd8cac5fe295');
        console.log(char)
        console.log('i am things')
        //const services = await connectedDevice.services();
        //console.log('services', services)
        //console.log('services', services);
        //const services = await device.services();
        try {
            // ae5f2916-d67d-42e5-b98c-753eb76416d9
             ssids
        const response = await populatedDevice.writeCharacteristicWithResponseForService(
            '6614b052-0c97-44ae-a417-fd8cac5fe295',
            'f3cbac8e-0628-4991-a7ea-22cb79e9febd',

            //'ffffffff-ffff-ffff-ffff-fffffffffff1

            base64.encode('joelwatson:somepassword')
        )

        await connectedDevice.cancelConnection();

        console.log(response)
        } catch(e) {
            console.log(e)
            await connectedDevice.cancelConnection();
        }

        //13333333333333333333333333330001
        // 13333333333333333333333333330002 service


    } else {
        console.log(device.name);
    }
}

const doScan = () => {
    console.log('doing a scan')
    ble = new BleManager();
    ble.stopDeviceScan();
    ble.startDeviceScan(null, {}, deviceFound)
};

const stopScan = () => {
    ble.stopDeviceScan();
};

const getPermission = async() => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'Permission Localisation Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }
    );
}
*/

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

const NavBar = props => {
    const {navigation, previous} = props;
    const title = get(props, 'scene.descriptor.options.title');
    const backBtn = <Appbar.BackAction onPress={navigation.goBack} />;
    const drawerBtn = <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />;

    return (
        <Appbar.Header>
            {previous && backBtn}
            {!previous && drawerBtn}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
};

const DrawerMenu = props => {
    return (
        <DrawerContentScrollView {...props}>
            <View>
                <Drawer.Section>
                    <Drawer.Item label="My Feels" onPress={() => {}} icon="emoticon-outline" />
                    <Drawer.Item label="Feels Groups" onPress={() => {}} icon="folder-multiple-image" />
                    <Drawer.Item label="Find Feels" onPress={() => {}} icon="magnify" />
                    <Drawer.Item label="Categories" onPress={() => {}} icon="view-list-outline" />
                    <Drawer.Item label="Devices" onPress={() => {}} icon="tablet" />
                    <Drawer.Item label="Device Groups" onPress={() => {}} icon="tablet-cellphone" />
                    <Drawer.Item label="My Account" onPress={() => {}} icon="account-box" />
                    <Drawer.Item label="Reload" onPress={() => {}} icon="reload" />
                    <Drawer.Item label="Logout" onPress={() => {}} icon="logout-variant" />
                </Drawer.Section>
            </View>
        </DrawerContentScrollView>
    );
};

const DrawerNav = createDrawerNavigator();
const Stack = createStackNavigator();
const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="categories" screenOptions={{header: NavBar}}>
            <Stack.Screen name="home" component={HomeScreen} options={{title: 'Home'}} />
            <Stack.Screen name="categories" component={Categories} options={{title: 'Categories'}} />
            <Stack.Screen name="next" component={NextScreen} options={{title: 'Next Thing'}} />
        </Stack.Navigator>
    );
};

export default props => {
    return (
        <Authentication>
            <PaperProvider>
                <SnackbarProvider>
                    <NavigationContainer>
                        <DrawerNav.Navigator drawerContent={props => <DrawerMenu {...props} />}>
                            <DrawerNav.Screen name="Home" component={StackNavigator} />
                        </DrawerNav.Navigator>
                    </NavigationContainer>
                </SnackbarProvider>
            </PaperProvider>
        </Authentication>
    );
};
