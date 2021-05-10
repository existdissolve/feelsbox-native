import React from 'react';
import {get} from 'lodash';
import color from 'color';
import {StyleSheet, View} from 'react-native';
import {Colors, List, Text, useTheme} from 'react-native-paper';

export default props => {
    const {children, label} = props;

    if (children) {
        const theme = useTheme();
        const textColor = get(theme, 'colors.text');
        const font = get(theme, 'fonts.medium');
        const subStyle = {
            ...styles.subheader,
            ...font
        };
        const textStyle = {
            ...styles.textLabel,
            color: color(textColor).alpha(0.54).rgb().string()
        };

        return (
            <View style={subStyle}>
                <View style={styles.wrapper}>
                    <Text style={textStyle}>{label}</Text>
                    <View style={styles.right}>
                        {children}
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <List.Subheader style={styles.subheader}>
                {label}
            </List.Subheader>
        );
    }
};

const styles = StyleSheet.create({
    subheader: {
        paddingVertical: 8,
        backgroundColor: Colors.grey900
    },
    textLabel: {
        flex: 1,
        marginLeft: 15,
        marginTop: 5
    },
    wrapper: {
        flexDirection: 'row'
    },
    right: {
        flexDirection: 'row'
    }
});
