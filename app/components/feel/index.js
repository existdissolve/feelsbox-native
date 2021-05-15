import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, IconButton, List, Paragraph, TextInput, useTheme} from 'react-native-paper';
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
import {getMyCategories} from '-/graphql/category';
import {CategoryPicker, Container, DevicePicker, Dialog, Fab, Feel, FriendPicker, Loading, SnackbarContext, Section, Subheader, Toolbar} from '-/components/shared';
import {groupFeels} from '-/components/feel/utils';

export default props => {
    const {navigation} = props;
    const displayMode = 'list';
    const theme = useTheme();
    const [currentItem, setCurrentItem] = useState(null);
    const [selectedDeviceGroups, setSelectedDeviceGroups] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [friendMessage, setFriendMessage] = useState('');
    const [isDevicePickerOpen, setIsDevicePickerOpen] = useState(false);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
    const [isFriendDialogOpen, setIsFriendDialogOpen] = useState(false);
    const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
    const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

    const results = useQuery(getFeels, {
        options: {notifyOnNetworkStatusChange: true}
    });
    const categoriesResults = useQuery(getMyCategories, {
        options: {notifyOnNetworkStatusChange: true}
    });
    const categories = get(categoriesResults, 'data.myCategories', []).map(category => {
        const {_id, name} = category;
        
        return {label: name, value: _id};
    });
    const loading = get(results, 'loading');
    const feels = get(results, 'data.feels', []);
    const action = currentItem ? 'Edit' : 'Add';
    const {show} = useContext(SnackbarContext);
    const groupedFeels = groupFeels(feels, {filter: []});

    const onAddPress = () => {

    };

    const onIconPress = (_id, fn) => {
        setCurrentItem(_id);

        fn();
    };

    const onDeviceSelectionChange = selections => {
        const {deviceGroups, devices} = selections;

        setSelectedDeviceGroups(deviceGroups);
        setSelectedDevices(devices);
    };

    const onFriendSelectionChange = selections => {
        setSelectedFriends(selections);
    };

    const onPushFeelPress = () => {
        
    };

    const onRemoveFeelPress = () => {
        
    };

    const onSendToFriendsPush = () => {

    };

    const onDisplayModePress = mode => {

    };

    const onFeelGroupPress = () => {

    };

    const onCategorySelect = categories => {
        console.log(categories)
    };

    const editFeel = () => {
        navigation.navigate('editfeel', {_id: currentItem});
    };

    const removeFeel = () => {
        setIsConfirmRemoveOpen(true);
    };

    const pushFeel = () => {
        setIsDevicePickerOpen(true);
    };

    const notifyFeel = () => {
        setIsFriendDialogOpen(true);
    };

    const subscribeFeel = () => {

    };

    const unsubscribeFeel = () => {

    };

    const copyFeel = () => {

    };

    return (
        <Container>
            <Toolbar>
                <IconButton icon="grid" onPress={onDisplayModePress.bind(null, 'grid')} />
                <IconButton icon="view-list" onPress={onDisplayModePress.bind(null, 'list')} />
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
                                    <View>
                                        {feels.map((feel, idx) => {
                                            return (
                                                <Divider key={idx} />
                                            );
                                        })}
                                    </View>
                                }
                                {displayMode === 'list' &&
                                    <View>
                                        {feels.map((feel, idx) => {
                                            const {_id, isOwner, isSubscribed, isSubscriptionOwner, name} = feel;
                                            const FeelThumb = () => <Feel feel={feel} wrapperStyle={{flex: .25}} pixelSize={4} />;
                                            const pushIcon = <IconButton icon="remote" onPress={onIconPress.bind(null, _id, pushFeel)} style={styles.listicon} />;
                                            const notifyIcon = <IconButton icon="account-voice" onPress={onIconPress.bind(null, _id, notifyFeel)} style={styles.listicon} />;
                                            const ActionIcons = () => (
                                                <View style={{flexDirection: 'row'}}>
                                                    {isOwner && 
                                                        <>
                                                            <IconButton icon="pencil" onPress={onIconPress.bind(null, _id, editFeel)} style={styles.listicon} />
                                                            <IconButton icon="close" onPress={onIconPress.bind(null, _id, removeFeel)} style={styles.listicon} />
                                                            {pushIcon}
                                                            {notifyIcon}    
                                                        </>
                                                    }
                                                    {!isOwner &&
                                                        <>
                                                            {isSubscriptionOwner && 
                                                                <IconButton icon="minus-box" onPress={onIconPress.bind(null, _id, unsubscribeFeel)} style={styles.listicon} />
                                                            }
                                                            {!isSubscribed &&
                                                                <IconButton icon="plus-box" onPress={onIconPress.bind(null, _id, subscribeFeel)} style={styles.listicon} />
                                                            }
                                                            <IconButton icon="flip-to-back" onPress={onIconPress.bind(null, _id, copyFeel)} style={styles.listicon} />
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
            <Dialog
                isOpen={isDevicePickerOpen}
                title="Send To Devices"
                saveText="Send"
                onCancelPress={() => setIsDevicePickerOpen(false)}
                onDialogClose={() => setIsDevicePickerOpen(false)}
                onSavePress={onPushFeelPress}>
                <DevicePicker onSelectionChange={onDeviceSelectionChange} />
            </Dialog>
            <Dialog
                isOpen={isFriendDialogOpen}
                title="Send to Friends"
                saveText="Send"
                onCancelPress={() => setIsFriendDialogOpen(false)}
                onDialogClose={() => setIsFriendDialogOpen(false)}
                onSavePress={onSendToFriendsPush}>
                <FriendPicker onSelectionChange={onFriendSelectionChange} />
                <TextInput label="Email" value={friendMessage} numberOfLines={3} onChangeText={text => setFriendMessage(text)} style={{marginTop: 10}} />
            </Dialog>
            <Dialog
                isOpen={isConfirmRemoveOpen}
                title="Remove Feel?"
                saveText="Yes"
                onCancelPress={() => setIsConfirmRemoveOpen(false)}
                onDialogClose={() => setIsConfirmRemoveOpen(false)}
                onSavePress={onRemoveFeelPress}>
                <Paragraph>Are you sure you want to remove this Feel from your collection permanently?</Paragraph>
            </Dialog>

            <Loading loading={loading} text="Loading My Feels..." />
            <Fab pressHandler={onAddPress} />
        </Container>
    );
};

const styles = StyleSheet.create({
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