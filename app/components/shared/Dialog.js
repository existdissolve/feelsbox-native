import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';

export default props => {
    const {
        children,
        closeText = 'Cancel',
        isOpen,
        onCancelPress,
        onDialogClose,
        onSavePress,
        saveText = 'Save',
        title,
        useCancel = true,
        useSave = true
    } = props;

    return (
        <Portal>
            <Dialog visible={isOpen} onDismiss={onDialogClose}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    {children}
                </Dialog.Content>
                <Dialog.Actions>
                    {useCancel &&
                        <Button mode="contained" onPress={onCancelPress} style={styles.cancelBtn}>{closeText}</Button>
                    }
                    {useSave &&
                        <Button mode="contained" onPress={onSavePress}>{saveText}</Button>
                    }
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    cancelBtn: {
        marginRight: 5
    }
});
