import React from 'react';
import {StyleSheet} from 'react-native';
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
    const defaultColor = get(theme, 'colors.default');

    return (
        <Portal>
            <Dialog visible={isOpen} onDismiss={onDialogClose}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    {children}
                </Dialog.Content>
                <Dialog.Actions>
                    {useCancel &&
                        <Button color={defaultColor} mode="contained" onPress={onCancelPress} style={styles.cancelBtn}>{cancelText}</Button>
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
        marginRight: 10
    }
});
