import React, {useContext, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {ScrollView, StyleSheet, View} from 'react-native';
import {IconButton, List, Paragraph, TextInput} from 'react-native-paper';
import {fromHsv, TriangleColorPicker} from 'react-native-color-picker';
import {get} from 'lodash';

import {Container, Dialog, Fab, Loading, SnackbarContext, Section, Subheader, Toolbar} from '-/components/shared';

const nodes = Array(64).fill(true);

const Pixel = props => {
    const {style: rawStyle} = props;
    const [height, setHeight] = useState(0);
    const onLayout = e => {
        //setHeight(get(e, 'nativeEvent.layout.width'));
    };
    const style = {
        ...rawStyle,
        aspectRatio: 1
        //height
    };

    return (
        <View style={style} />
    );
};

export default () => {
    /*const results = useQuery(getMyCategories, {
        options: {notifyOnNetworkStatusChange: true}
    });
    const loading = get(results, 'loading');*/
    const [currentColor, setCurrentColor] = useState(undefined);
    const {show} = useContext(SnackbarContext);

    const onColorChange = color => {
        setCurrentColor(color);
    };

    return (
        <Container>
            <Toolbar>
                <IconButton icon="undo" />
                <IconButton icon="notification-clear-all"  />
                <IconButton icon="chevron-left"  />
                <IconButton icon="chevron-right" />
                <IconButton icon="layers-plus" />
                <IconButton icon="image-album" />
                <Paragraph style={styles.frameCount}>1 / 1</Paragraph>
            </Toolbar>
            <View style={styles.checkerboard}>
                {nodes.map((num, idx) => {
                    const row = Math.floor(idx / 8);
                    let pixelStyle;

                    if (idx % 2 === 0 && row % 2 === 0) {
                        pixelStyle = 'even';
                    } else if (idx % 2 !== 0 && row % 2 !== 0) {
                        pixelStyle = 'even';
                    } else {
                        pixelStyle = 'odd';
                    }

                    return (
                        <Pixel style={styles[pixelStyle]} key={`pixel-${idx}`} />
                    );
                })}
            </View>
            <TriangleColorPicker
                color={currentColor}
                onColorChange={onColorChange}
                style={styles.colorPicker} />
        </Container>
    );
};
const basePixel = {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '12.5%'
};
const styles = StyleSheet.create({
    checkerboard: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    colorPicker: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
        backgroundColor: '#222'
    },
    odd: {
        ...basePixel
    },
    even: {
        ...basePixel,
        backgroundColor: 'black'
    },
    frameCount: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 12,
        marginRight: 15,
        flex: 1,
        textAlign: 'right'
    }
});
