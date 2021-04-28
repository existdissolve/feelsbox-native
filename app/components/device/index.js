import React, {Fragment, useContext, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Divider, IconButton, List, Menu, useTheme} from 'react-native-paper';
import {get} from 'lodash';

import {
    getDevices,
    restart as restartMutation,
    setBrightness as setBrightnessMutation,
    submitAccessCode as submitAccessCodeMutation,
    turnOff as turnOffMutation,
    updateDevice as updateDeviceMutation
} from '-/graphql/device';
import {setDefaultDevice as setDefaultDeviceMutation} from '-/graphql/user';
import {Container, Dialog, Loading, SnackbarContext, Section, Subheader} from '-/components/shared';

export default props => {
    const {navigation} = props;
    const [currentItem, setCurrentItem] = useState(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [restart] = useMutation(restartMutation);
    const [setBrightness] = useMutation(setBrightnessMutation);
    const [submitAccessCode] = useMutation(submitAccessCodeMutation);
    const [setDefaultDevice] = useMutation(setDefaultDeviceMutation);
    const [turnOff] = useMutation(turnOffMutation);
    const [updateDevice] = useMutation(updateDeviceMutation);
    const theme = useTheme();
    const color = get(theme, 'colors.accent');
    const results = useQuery(getDevices, {
        options: {notifyOnNetworkStatusChange: true}
    });
    const devices = get(results, 'data.devices', []);
    const loading = get(results, 'loading');
    const {show} = useContext(SnackbarContext);
    const groups = devices.reduce((groups, device) => {
        const {isOwner} = device;
        const group = isOwner ? 'mine' : 'others';

        groups[group].devices.push(device);

        return groups;
    }, {
        mine: {
            label: 'My Devices',
            devices: []
        },
        others: {
            label: 'Other Devices',
            devices: []
        }
    });

    const onTurnOffClick = async _id => {
        await turnOff({
            variables: {_id}
        });

        show('Device was turned off successfully!');
    };

    const onSetBrightnessClick = async _id => {

    };

    const onDefaultClick = async _id => {
        await setDefaultDevice({
            awaitRefetchQueries: true,
            refetchQueries: [{
                query: getDevices
            }],
            variables: {_id}
        });

        show('Default device was changed successfully!');
    };

    const onRestartPress = async() => {
        await restart({
            variables: {_id: currentItem}
        });

        show('Device will restart shortly!');

        onCloseMenu();
    };

    const onUpdatePress = async() => {
        await updateDevice({
            variables: {_id: currentItem}
        });

        show('Device will update and restart shortly!');

        onCloseMenu();
    };

    const onHistoryPress = async() => {
        onCloseMenu();

        navigation.navigate('devicehistory', {_id: currentItem});
    };

    const onOpenMenu = (_id, e) => {
        e.target.measure((fx, fy, width, height, px, py) => {
            setCurrentItem(_id);
            setMenuAnchor({x: px, y: py});
            setIsMenuVisible(true);
        });
    };

    const onCloseMenu = () => {
        setMenuAnchor(null);
        setIsMenuVisible(false);
        setCurrentItem(null);
    };

    const onEditPress = _id => {

    };

    return (
        <Container>
            {!loading &&
                <ScrollView>
                    {Object.keys(groups).map(key => {
                        const group = groups[key];
                        const {label, devices} = group;

                        if (!devices.length) {
                            return null;
                        }

                        return (
                            <Section key={key}>
                                <Subheader label={label} />
                                {devices.map((device, deviceIdx) => {
                                    const {_id, isDefault, isOwner, name} = device;
                                    const accountIcon = isOwner ? 'account-circle' : 'account-supervisor-circle';
                                    const accountAction = isOwner ? onEditPress.bind(null, _id) : undefined;
                                    const AccountIcon = () => <IconButton icon={accountIcon} onPress={accountAction} style={styles.listicon} />;
                                    const ActionIcons = () => (
                                        <View style={{flexDirection: 'row'}}>
                                            {isOwner && <IconButton icon="flash-off" onPress={onTurnOffClick.bind(null, _id)} style={styles.listicon} />}
                                            {isOwner && <IconButton icon="brightness-6" onPress={onSetBrightnessClick.bind(null, _id)} style={styles.listicon} />}
                                            {isOwner && <IconButton icon="dots-vertical" onPress={onOpenMenu.bind(null, _id)} style={styles.listicon} />}
                                            <IconButton icon="remote" color={isDefault ? color : undefined} onPress={onDefaultClick.bind(null, _id)} style={styles.listicon} />
                                        </View>
                                    );
                                    return (
                                        <Fragment key={deviceIdx}>
                                            <List.Item title={name} right={ActionIcons} left={AccountIcon} />
                                            {deviceIdx < devices.length - 1 &&
                                                <Divider />
                                            }
                                        </Fragment>
                                    );
                                })}
                            </Section>
                        );
                    })}
                </ScrollView>
            }
            <Loading loading={loading} text="Loading Devices..." />
            <Menu visible={isMenuVisible} onDismiss={onCloseMenu} anchor={menuAnchor}>
                <Menu.Item icon="power" onPress={onRestartPress} title="Restart Device" />
                <Divider />
                <Menu.Item icon="cellphone-arrow-down" onPress={onUpdatePress} title="Update Device" />
                <Divider />
                <Menu.Item icon="history" onPress={onHistoryPress} title="Device History" />
            </Menu>
        </Container>
    );
};

const styles = StyleSheet.create({
    listicon: {
        marginLeft: 4,
        marginRight: 4
    }
});