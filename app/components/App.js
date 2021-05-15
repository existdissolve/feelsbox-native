import React, {useEffect, useMemo, useState} from 'react';
import 'react-native-gesture-handler';
import {Colors, DarkTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'base-64';

import Authentication from '-/components/Authentication';
import SnackbarProvider from '-/components/shared/Snackbar';
import {PreferencesContext} from '-/components/shared/Preferences';
import DrawerMenu from '-/components/Drawer';
import Stack from '-/components/Stack';
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

const DrawerNav = createDrawerNavigator();
const themes = {
    blue: {
        colors: {
            accent: '#f50057',
            default: '#e0e0e0',
            primary: '#3f51b5'
        }
    },
    sorbet: {
        colors: {
            accent: '#d500f9',
            default: '#e0e0e0',
            primary: '#e91e63'
        }
    },
    grassy: {
        colors: {
            accent: '#c6ff00',
            default: '#e0e0e0',
            primary: '#4caf50'
        }
    },
    ocean: {
        colors: {
            accent: '#00e5ff',
            default: '#e0e0e0',
            primary: '#009688'
        }
    },
    sunrise: {
        colors: {
            accent: '#ffea00',
            default: '#e0e0e0',
            primary: '#ff9800'
        }
    }
};

export default () => {
    const [theme, setTheme] = useState('blue');

    useEffect(() => {
        const fetchStorage = async() => {
            const appThemeValue = await AsyncStorage.getItem('appTheme');

            if (appThemeValue) {
                setTheme(appThemeValue);
            }
        };

        fetchStorage();
    }, []);

    const toggleTheme = theme => {
        setTheme(theme);
    };
    
    const preferences = useMemo(() => ({
        toggleTheme,
        theme
    }), [toggleTheme, theme]);

    const themeData = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            ...themes[theme].colors,
            background: Colors.grey800
        },
        roundness: 4
    };

    return (
        <Authentication>
            <PreferencesContext.Provider value={preferences}>
                <PaperProvider theme={themeData}>
                    <SnackbarProvider>
                        <NavigationContainer>
                            <DrawerNav.Navigator drawerContent={props => <DrawerMenu {...props} />}>
                                <DrawerNav.Screen name="Home" component={Stack} />
                            </DrawerNav.Navigator>
                        </NavigationContainer>
                    </SnackbarProvider>
                </PaperProvider>
            </PreferencesContext.Provider>
        </Authentication>
    );
};
