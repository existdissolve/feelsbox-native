import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, Portal, useTheme} from 'react-native-paper';
import {get} from 'lodash';

export default props => {
    const {
        children,
        cancelText = 'Cancel',
        isOpen,
        onCancelPress,
        onDialogClose,
        onSavePress,
        saveText = 'Save',
        title,
        useCancel = true,
        useSave = true
    } = props;
    const theme = useTheme();
    const accentColor = get(theme, 'colors.accent');
    const defaultColor = get(theme, 'colors.default');

    return (
        <Portal>
            <Dialog visible={isOpen} onDismiss={onDialogClose} styles={{display: 'flex'}}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView>{children}</ScrollView>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    {useCancel &&
                        <Button color={defaultColor} mode="contained" onPress={onCancelPress} style={styles.cancelBtn}>{cancelText}</Button>
                    }
                    {useSave &&
                        <Button color={accentColor} mode="contained" onPress={onSavePress}>{saveText}</Button>
                    }
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    cancelBtn: {
        marginRight: 10
    }
});
