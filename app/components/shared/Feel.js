import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Surface} from 'react-native-paper';

export default props => {
    const {feel, wrapperStyle, pixelSize} = props;
    const {frames = []} = feel;
    const thumb = frames.find(frame => frame.isThumb) || frames[0];
    const {uri} = thumb;
    const pixelDim = pixelSize * 8;
    const dim = pixelDim + (pixelSize * 2);
    const feelStyle = {
        ...styles.feel,
        padding: pixelSize,
        height: dim,
        width: dim
    };

    return (
        <View style={wrapperStyle}>
            <Surface style={feelStyle}>
                <Image style={{width: pixelDim, height: pixelDim}} source={{uri: `data:image/png;base64,${uri}`}} />
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    feel: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginLeft: 0,
        marginVertical: 0,
        marginTop: 5
    }
});
