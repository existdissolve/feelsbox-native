import React from 'react';
import {StyleSheet} from 'react-native';
import {Colors, List} from 'react-native-paper';

export default props => {
    const {label} = props;

    return (
        <List.Subheader style={styles.subheader}>{label}</List.Subheader>
    );
};

const styles = StyleSheet.create({
    subheader: {
        paddingVertical: 8,
        backgroundColor: Colors.grey900
    }
});
