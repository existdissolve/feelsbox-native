import React, {useState} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Surface, useTheme} from 'react-native-paper';

export default props => {
    const {feel, isSelected, longPressHandler, mode = 'list', pressHandler, wrapperStyle, pixelSize} = props;
    const [isPressed, setIsPressed] = useState(false);
    const theme = useTheme();
    const {frames = []} = feel;
    const thumb = frames.find(frame => frame.isThumb) || frames[0];
    const {uri} = thumb;
    const pixelDim = pixelSize * 8;
    const dim = pixelDim + (pixelSize * 2);
    const feelStyle = {
        ...styles.feel,
        padding: pixelSize,
        height: dim,
        width: dim,
        ...(isPressed || isSelected) && {
            backgroundColor: theme.colors.accent
        },
        ...mode === 'grid' && {
            borderRadius: theme.roundness
        }
    };

    const onPressIn = () => {
        if (!pressHandler) {
            return false;
        }

        setIsPressed(true);
    };

    const onPressOut = () => {
        if (!pressHandler) {
            return false;
        }

        setIsPressed(false);
    };

    return (
        <View style={wrapperStyle}>
            <TouchableWithoutFeedback onLongPress={longPressHandler} onPress={pressHandler} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Surface style={feelStyle}>
                    <Image style={{width: pixelDim, height: pixelDim}} source={{uri: `data:image/png;base64,${uri}`}} />
                </Surface>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    feel: {
        elevation: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginLeft: 0,
        marginVertical: 0
    }
});
