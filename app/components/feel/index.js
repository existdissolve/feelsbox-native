import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Divider, IconButton, List, Menu, Paragraph, TextInput, Title, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get} from 'lodash';

import {
    copyFeel as copyFeelMutation, 
    getFeels, 
    removeFeel as removeFeelMutation, 
    sendFeel as sendFeelMutation, 
    sendMessage as sendMessageMutation, 
    subscribe as subscribeMutation, 
    unsubscribe as unsubscribeMutation
} from '-/graphql/feel';
import {CategoryPicker, Container, DevicePicker, Dialog, Fab, Feel, FriendPicker, Loading, SnackbarContext, Section, Subheader, Toolbar} from '-/components/shared';
import {groupFeels} from '-/components/feel/utils';

export default props => {
    const {navigation} = props;
    const theme = useTheme();
    const [currentItem, setCurrentItem] = useState(null);
    const [displayMode, setDisplayMode] = useState('grid');
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
    const [selectedDeviceGroups, setSelectedDeviceGroups] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState();
    const [friendMessage, setFriendMessage] = useState('');
    const [deviceMessage, setDeviceMessage] = useState('');
    const [messageDuration, setMessageDuration] = useState('');
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [isDevicePickerOpen, setIsDevicePickerOpen] = useState(false);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
    const [isFriendDialogOpen, setIsFriendDialogOpen] = useState(false);
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
    const [copyFeel] = useMutation(copyFeelMutation);
    const [removeFeel] = useMutation(removeFeelMutation);
    const [sendFeel] = useMutation(sendFeelMutation);
    const [sendMessage] = useMutation(sendMessageMutation);
    const [subscribe] = useMutation(subscribeMutation);
    const [unsubscribe] = useMutation(unsubscribeMutation);

    const results = useQuery(getFeels, {
        options: {notifyOnNetworkStatusChange: true}
    });
    const loading = get(results, 'loading');
    const feels = get(results, 'data.feels', []);
    const {show} = useContext(SnackbarContext);
    const groupedFeels = groupFeels(feels, {filter: selectedCategories});

    const onAddPress = () => {
        navigation.navigate('feel');
    };

    const onIconPress = (_id, fn) => {
        setCurrentItem(_id);
        fn(_id);
    };

    const onDeviceSelectionChange = selections => {
        const {deviceGroups, devices} = selections;

        setSelectedDeviceGroups(deviceGroups);
        setSelectedDevices(devices);
    };

    const onFriendSelectionChange = selections => {
        setSelectedFriends(selections);
    };

    const onPushFeelPress = async() => {
        onDevicePickerDismiss();

        await sendFeel({
            variables: {
                _id: currentItem,
                data: {
                    devices: selectedDevices,
                    deviceGroups: selectedDeviceGroups
                }
            }
        });

        show('Feel was sent successfully!');
    };

    const onRemoveFeelPress = async() => {
        onConfirmDialogDismiss();

        await removeFeel({
            variables: {_id: currentItem}
        });

        show('Feel was successfully removed!');
    };

    const onSendToFriendsPress = async() => {
        onFriendDialogDismiss();

        await sendFeel({
            variables: {
                _id: currentItem,
                data: {
                    isNotification: true,
                    notification: friendMessage,
                    users: selectedFriends
                }
            }
        });

        show('Feel was sent successfully!');
    };

    const onDisplayModePress = async mode => {
        setDisplayMode(mode);
    };

    const onFeelGroupPress = () => {
        navigation.navigate('feelgroups');
    };

    const onSendMessagePress = async() => {
        onMessageDialogDismiss();

        await sendMessage({
            variables: {
                _id: currentItem,
                data: {
                    devices: selectedDevices,
                    deviceGroups: selectedDeviceGroups,
                    duration: messageDuration,
                    message: deviceMessage
                }
            }
        });

        show('Message was sent successfully!');
    };

    const onLongPressFeel = (_id, e) => {
        e.target.measure((fx, fy, width, height, px, py) => {
            setCurrentItem(_id);
            setIsContextMenuOpen(true);
            setContextMenuAnchor({x: px, y: py});
        });
    };

    const onPressFeel = async _id => {
        await sendFeel({
            variables: {_id}
        });

        show('Feel was sent successfully!');
    };

    const onCategorySelect = categories => {
        setSelectedCategories(categories);
    };

    const onDevicePickerDismiss = () => {
        setIsDevicePickerOpen(false);
    };
    
    const onMessageDialogDismiss = () => {
        setIsMessageDialogOpen(false);
    };

    const onFriendDialogDismiss = () => {
        setIsFriendDialogOpen(false);
    };

    const onConfirmDialogDismiss = () => {
        setIsConfirmRemoveOpen(false);
    };

    const onContextMenuDismiss = () => {
        setIsContextMenuOpen(false);
    };

    const onContextMenuPress = fn => {
        onContextMenuDismiss();
        fn();
    };

    const onEditFeel = id => {
        const _id = id || currentItem;

        navigation.navigate('feel', {_id});
    };

    const onRemoveFeel = () => {
        setIsConfirmRemoveOpen(true);
    };

    const onPushFeel = () => {
        setIsDevicePickerOpen(true);
    };

    const onNotifyFeel = () => {
        setIsFriendDialogOpen(true);
    };

    const onSubscribeFeel = async id => {
        const _id = id || currentItem;

        await subscribe({
            variables: {_id}
        });

        show('Removed from Favs!');
    };

    const onUnsubscribeFeel = async id => {
        const _id = id || currentItem;

        await unsubscribe({
            variables: {_id}
        });

        show('Removed from Favs!');
    };

    const onCopyFeel = async id => {
        const _id = id || currentItem;

        await copyFeel({
            awaitRefetchQueries: true,
            refetchQueries: [{
                fetchPolicy: 'network-only',
                query: getFeels
            }],
            variables: {_id}
        });

        show('Added to My Feels!');
    };

    useEffect(() => {
        const fetchStorage = async() => {
            const displayMode = await AsyncStorage.getItem('displayMode');

            if (displayMode) {
                setDisplayMode(displayMode);
            }
        };

        fetchStorage();
    }, []);

    const currentFeel = feels.find(feel => feel._id === currentItem);
    const currentFeelName = get(currentFeel, 'name');
    const isCurrentFeelOwner = get(currentFeel, 'isOwner', false);
    const isCurrentFeelSubscribed = get(currentFeel, 'isSubscribed', false);
    const isCurrentFeelSubscriptionOwner = get(currentFeel, 'isSubscriptionOwner', false);

    return (
        <Container>
            <Toolbar>
                <IconButton icon="grid" onPress={onDisplayModePress.bind(null, 'grid')} color={displayMode === 'grid' ? theme.colors.accent : undefined} />
                <IconButton icon="view-list" onPress={onDisplayModePress.bind(null, 'list')} color={displayMode === 'list' ? theme.colors.accent : undefined} />
                <CategoryPicker onSelectionChange={onCategorySelect} />
                <IconButton icon="message-text" onPress={() => setIsMessageDialogOpen(true)} />
                <IconButton icon="group" onPress={onFeelGroupPress} />
            </Toolbar>
            {!loading &&
                <ScrollView>
                    {groupedFeels.map(group => {
                        const {_id, name, feels = []} = group;

                        return (
                            <Section key={_id}>
                                <Subheader label={name} />
                                {displayMode === 'grid' &&
                                    <View style={styles.grid}>
                                        {feels.map(feel => {
                                            const {_id} = feel;

                                            return (
                                                <Feel 
                                                    key={`${name}_${_id}`} 
                                                    feel={feel} 
                                                    wrapperStyle={styles.gridItem} pixelSize={8}
                                                    longPressHandler={onLongPressFeel.bind(null, _id)}
                                                    pressHandler={onPressFeel.bind(null, _id)}
                                                    mode={displayMode} />
                                            );
                                        })}
                                    </View>
                                }
                                {displayMode === 'list' &&
                                    <View>
                                        {feels.map((feel, idx) => {
                                            const {_id, isOwner, isSubscribed, isSubscriptionOwner, name} = feel;
                                            const FeelThumb = () => <Feel feel={feel} wrapperStyle={styles.listItem} pixelSize={4} pressHandler={onPressFeel.bind(null, _id)} />;
                                            const pushIcon = <IconButton icon="remote" onPress={onIconPress.bind(null, _id, onPushFeel)} style={styles.listicon} />;
                                            const notifyIcon = <IconButton icon="account-voice" onPress={onIconPress.bind(null, _id, onNotifyFeel)} style={styles.listicon} />;
                                            const ActionIcons = () => (
                                                <View style={{flexDirection: 'row'}}>
                                                    {isOwner && 
                                                        <>
                                                            <IconButton icon="pencil" onPress={onIconPress.bind(null, _id, onEditFeel)} style={styles.listicon} />
                                                            <IconButton icon="close" onPress={onIconPress.bind(null, _id, onRemoveFeel)} style={styles.listicon} />
                                                            {pushIcon}
                                                            {notifyIcon}    
                                                        </>
                                                    }
                                                    {!isOwner &&
                                                        <>
                                                            {isSubscriptionOwner && 
                                                                <IconButton icon="minus-box" onPress={onIconPress.bind(null, _id, onUnsubscribeFeel)} style={styles.listicon} />
                                                            }
                                                            {!isSubscribed &&
                                                                <IconButton icon="plus-box" onPress={onIconPress.bind(null, _id, onSubscribeFeel)} style={styles.listicon} />
                                                            }
                                                            <IconButton icon="flip-to-back" onPress={onIconPress.bind(null, _id, onCopyFeel)} style={styles.listicon} />
                                                            {pushIcon}
                                                            {notifyIcon} 
                                                        </>
                                                    }    
                                                </View>
                                            );

                                            return (
                                                <Fragment key={`${_id}_${idx}`}>
                                                    <List.Item key={idx} title={name} left={FeelThumb} right={ActionIcons} />
                                                    {idx < feels.length - 1 &&
                                                        <Divider />
                                                    }
                                                </Fragment>
                                            );
                                        })}
                                    </View>
                                }
                            </Section>
                        );
                    })}
                </ScrollView>
            }
            <Menu visible={isContextMenuOpen} onDismiss={onContextMenuDismiss} anchor={contextMenuAnchor}>
                <Title style={styles.menuTitle}>{currentFeelName}</Title>
                {isCurrentFeelOwner && 
                    <>
                        <Menu.Item icon="pencil" onPress={onContextMenuPress.bind(null, onEditFeel)} title="Edit Feel" />
                        <Divider />
                        <Menu.Item icon="close" onPress={onContextMenuPress.bind(null, onRemoveFeel)} title="Remove Feel" />
                        <Divider />
                        <Menu.Item icon="remote" onPress={onContextMenuPress.bind(null, onPushFeel)} title="Send to Devices" />
                        <Divider />
                        <Menu.Item icon="account-voice" onPress={onContextMenuPress.bind(null, onNotifyFeel)} title="Send to Friends" />
                    </>
                }
                {!isCurrentFeelOwner &&
                    <>
                        {isCurrentFeelSubscriptionOwner && 
                            <>
                                <Menu.Item icon="minus-box" onPress={onContextMenuPress.bind(null, onUnsubscribeFeel)} title="Remove from Favs" />
                                <Divider />
                            </>
                        }
                        {!isCurrentFeelSubscribed &&
                            <>
                                <Menu.Item icon="plus-box" onPress={onContextMenuPress.bind(null, onSubscribeFeel)} title="Save to Favs" />
                                <Divider />
                            </>
                        }
                        <Menu.Item icon="flip-to-back" onPress={onContextMenuPress.bind(null, onCopyFeel)} title="Copy to My Feels" />
                        <Divider />
                        <Menu.Item icon="remote" onPress={onContextMenuPress.bind(null, onPushFeel)} title="Send to Devices" />
                        <Divider />
                        <Menu.Item icon="account-voice" onPress={onContextMenuPress.bind(null, onNotifyFeel)} title="Send to Friends" /> 
                    </>
                }    
            </Menu>
            <Dialog
                isOpen={isDevicePickerOpen}
                title="Send To Devices"
                saveText="Send"
                onCancelPress={onDevicePickerDismiss}
                onDialogClose={onDevicePickerDismiss}
                onSavePress={onPushFeelPress}>
                <DevicePicker onSelectionChange={onDeviceSelectionChange} />
            </Dialog>
            <Dialog
                isOpen={isMessageDialogOpen}
                title="Send Message To Devices"
                saveText="Send"
                onCancelPress={onMessageDialogDismiss}
                onDialogClose={onMessageDialogDismiss}
                onSavePress={onSendMessagePress}>
                <TextInput 
                    mode="outlined" 
                    label="Message" 
                    value={deviceMessage} 
                    numberOfLines={1} 
                    onChangeText={text => setDeviceMessage(text)} />
                <TextInput 
                    mode="outlined" 
                    label="Duration" 
                    value={messageDuration} 
                    numberOfLines={1} 
                    onChangeText={text => setMessageDuration(text)} 
                    keyboardType="numeric" />    
                <DevicePicker onSelectionChange={onDeviceSelectionChange} />
            </Dialog>
            <Dialog
                isOpen={isFriendDialogOpen}
                title="Send to Friends"
                saveText="Send"
                onCancelPress={onFriendDialogDismiss}
                onDialogClose={onFriendDialogDismiss}
                onSavePress={onSendToFriendsPress}>
                <FriendPicker onSelectionChange={onFriendSelectionChange} />
                <TextInput 
                    label="Message" 
                    mode="outlined"
                    value={friendMessage} 
                    numberOfLines={3} 
                    onChangeText={text => setFriendMessage(text)} 
                    style={{marginTop: 10}} />
            </Dialog>
            <Dialog
                isOpen={isConfirmRemoveOpen}
                title="Remove Feel?"
                saveText="Yes"
                onCancelPress={onConfirmDialogDismiss}
                onDialogClose={onConfirmDialogDismiss}
                onSavePress={onRemoveFeelPress}>
                <Paragraph>Are you sure you want to remove this Feel from your collection permanently?</Paragraph>
            </Dialog>

            <Loading loading={loading} text="Loading My Feels..." />
            <Fab pressHandler={onAddPress} />
        </Container>
    );
};

const styles = StyleSheet.create({
    grid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 15
    },
    gridItem: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: '33%',
        alignItems: 'center',
        marginBottom: 15,
        borderRadius: 5
    },
    listItem: {
        flex: .25, 
        marginTop: 5
    },
    menuTitle: {
        marginLeft: 15
    },
    dropdown: {
        flex: 1,
        marginHorizontal: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'green'
    },
    listicon: {
        marginLeft: 0,
        marginRight: 0
    },
    sliderContainer: {
        flexDirection: 'row'
    }
});