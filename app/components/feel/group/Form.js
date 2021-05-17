import React, {Fragment, useContext, useLayoutEffect, useState} from 'react';
import {Divider, IconButton, List, Paragraph, TextInput, useTheme} from 'react-native-paper';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useMutation, useQuery} from '@apollo/client';
import {get} from 'lodash';

import {CategoryPicker, Container, Dialog, Feel, Loading, Section, SnackbarContext, Subheader, Toolbar} from '-/components/shared';
import {groupFeels} from '-/components/feel/utils';
import {getFeels} from '-/graphql/feel';
import {
    addFeelGroup as addFeelGroupMutation, 
    editFeelGroup as editFeelGroupMutation, 
    getFeelGroup,
    getFeelGroups
} from '-/graphql/feelGroup';

export default props => {
    const _id = get(props, 'route.params._id');
    const [activeItem, setActiveItem] = useState(null);
    const [duration, setDuration] = useState(1000);
    const [name, setName] = useState('New Feels Group');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selections, setSelections] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [addFeelGroup] = useMutation(addFeelGroupMutation);
    const [editFeelGroup] = useMutation(editFeelGroupMutation);
    const {show} = useContext(SnackbarContext);
    const theme = useTheme();
    const color = get(theme, 'colors.primary');

    const onFeelGroupLoaded = data => {
        const name = get(data, 'feelGroup.name');
        const feels = get(data, 'feelGroup.feels');
        const duration = get(data, 'feelGroup.duration');

        setDuration(duration);
        setName(name);
        setSelections(feels);
    };

    const onDialogClose = () => {
        setIsDialogOpen(false);
    };

    const onEditPress = () => {
        setIsDialogOpen(true);
    };

    const onSavePress = async() => {
        const data = {
            duration,
            feels: selections.map(item => item._id),
            name
        };

        if (!_id) {
            const {navigation} = props;
            const result = await addFeelGroup({
                variables: {data},
                refetchQueries: [{
                    fetchPolicy: 'network-only',
                    query: getFeelGroups
                }]
            });

            const newId = get(result, 'data.addFeelGroup._id');

            show('Feels Group was add successfully!');
            navigation.navigate('editfeelgroup', {_id: newId});
        } else {
            await editFeelGroup({
                variables: {_id, data}
            });

            show('Feels Group was edited successfully!');
        }

        onDialogClose();
    };

    const onClearPress = () => {
        setSelections([]);
    };

    const onRemovePress = () => {
        const newSelections = selections.slice();
        const index = newSelections.findIndex(item => item._id === activeItem);

        if (index !== -1) {
            newSelections.splice(index, 1);

            setSelections(newSelections);
        }

        setActiveItem(null);
    };

    const onAddPress = _id => {
        const newSelections = selections.slice();
        const item = feels.find(item => item._id === _id);

        if (item) {
            newSelections.push(item);

            setSelections(newSelections);
        }
    };

    const onMoveBack = () => {

    };

    const onMoveForward = () => {

    };

    const onCategorySelect = categories => {

    };

    let loading = false;

    if (_id) {
        const result = useQuery(getFeelGroup, {
            notifyOnNetworkStatusChange: true,
            onCompleted: onFeelGroupLoaded,
            variables: {_id}
        });

        loading = get(result, 'loading');
    }

    const feelsResults = useQuery(getFeels, {
        notifyOnNetworkStatusChange: true
    });
    const feelsLoading = get(feelsResults, 'loading');
    const feels = get(feelsResults, 'data.feels', []);
    const groupedFeels = groupFeels(feels, {filter: selectedCategories});
    
    useLayoutEffect(() => {
        const {navigation} = props;

        navigation.setOptions({
            actions: (
                <IconButton icon="content-save" onPress={onEditPress} />
            )
        });
    });

    return (
        <Container>
            <Toolbar>
                <IconButton icon="notification-clear-all" onPress={onClearPress} disabled={!selections.length} />
                <IconButton icon="close" onPress={onRemovePress} disabled={!activeItem} />
                <IconButton icon="chevron-left" onPress={onMoveBack} disabled={!activeItem} />
                <IconButton icon="chevron-right" onPress={onMoveForward} disabled={!activeItem} />
            </Toolbar>
            <View>
                {!loading && 
                    <ScrollView>
                        <Subheader label={name} />
                        {selections.length < 1 ?
                            <Paragraph style={styles.emptyText}>You haven&apos;t added any feels to this group...yet!</Paragraph>
                            :
                            <View style={styles.grid}>
                                {selections.map(feel => {
                                    const {_id} = feel;

                                    return (
                                        <Feel 
                                            key={`${name}_${_id}`} 
                                            feel={feel} 
                                            wrapperStyle={styles.gridItem} pixelSize={8}
                                            mode="grid" />
                                    );
                                })}
                            </View>
                        }
                        
                    </ScrollView>
                }
                <Loading loading={loading} text="Loading Feels Group..." />
            </View>
            <View>
                <Toolbar>
                    <CategoryPicker onSelectionChange={onCategorySelect} />
                </Toolbar>
                {!feelsLoading && 
                    <ScrollView>
                        {groupedFeels.map(group => {
                            const {_id, name, feels = []} = group;
                            
                            return (
                                <Section key={_id}>
                                    <Subheader label={name} />
                                    <View>
                                        {feels.map((feel, idx) => {
                                            const {_id, name} = feel;
                                            const FeelThumb = () => <Feel feel={feel} wrapperStyle={styles.listItem} pixelSize={4} />;
                                            const AddIcon = () => <IconButton icon="add" onPress={onAddPress.bind(null, _id)} style={styles.listicon} />;
                                            
                                            return (
                                                <Fragment key={`${_id}_${idx}`}>
                                                    <List.Item key={idx} title={name} left={FeelThumb} right={AddIcon}  />
                                                    {idx < feels.length - 1 &&
                                                        <Divider />
                                                    }
                                                </Fragment>
                                            );
                                        })}
                                    </View>
                                </Section>
                            );
                        })}
                    </ScrollView>
                }
            </View>
            <Dialog
                isOpen={isDialogOpen}
                title="Save Feels Group"
                onCancelPress={onDialogClose}
                onDialogClose={onDialogClose}
                onSavePress={onSavePress}>
                <TextInput 
                    label="Feels Group Name" 
                    value={name} 
                    onChangeText={value => setName(value)} />
                <TextInput 
                    mode="outlined" 
                    label="Duration" 
                    value={duration} 
                    numberOfLines={1} 
                    onChangeText={text => setDuration(text)} 
                    keyboardType="numeric" />    
            </Dialog>
        </Container>
    );
};

const styles = StyleSheet.create({
    emptyText: {
        padding: 15
    },
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
    listicon: {
        marginLeft: 0,
        marginRight: 0
    },
    listItem: {
        flex: .25, 
        marginTop: 5
    }
});
