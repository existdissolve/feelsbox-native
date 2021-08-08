import React from 'react';
import {Drawer, useTheme} from 'react-native-paper';
import {View} from 'react-native';
import {get} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerContentScrollView} from '@react-navigation/drawer';

export default props => {
    const {navigation} = props;
    const theme = useTheme();
    const style = {
        backgroundColor: get(theme, 'colors.background')
    };

    const onPress = destination => {
        navigation.navigate(destination);
        AsyncStorage.setItem('lastRoute', destination);
    };

    return (
        <DrawerContentScrollView {...props} style={style}>
            <View>
                <Drawer.Section>
                    <Drawer.Item label="My Feels" onPress={onPress.bind(null, 'feels')} icon="emoticon-outline" />
                    <Drawer.Item label="Feels Groups" onPress={onPress.bind(null, 'feelgroups')} icon="folder-multiple-image" />
                    <Drawer.Item label="Find Feels" onPress={onPress.bind(null, 'findfeels')} icon="magnify" />
                    <Drawer.Item label="Categories" onPress={onPress.bind(null, 'categories')} icon="view-list-outline" />
                    <Drawer.Item label="Devices" onPress={onPress.bind(null, 'devices')} icon="tablet" />
                    <Drawer.Item label="Device Groups" onPress={onPress.bind(null, 'devicegroups')} icon="tablet-cellphone" />
                    <Drawer.Item label="Connect Device" onPress={onPress.bind(null, 'bluetooth')} icon="bluetooth-connect" />
                    <Drawer.Item label="My Account" onPress={onPress.bind(null, 'account')} icon="account-box" />
                    <Drawer.Item label="Reload" onPress={onPress.bind(null, '')} icon="reload" />
                    <Drawer.Item label="Logout" onPress={onPress.bind(null, '')} icon="logout-variant" />
                </Drawer.Section>
            </View>
        </DrawerContentScrollView>
    );
};
