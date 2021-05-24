import React, {createRef, useContext, useMemo, useRef, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {findNodeHandle, PanResponder, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {IconButton, List, Paragraph, TextInput} from 'react-native-paper';
import {fromHsv, TriangleColorPicker} from 'react-native-color-picker';
import {cloneDeep, get, last, set} from 'lodash';

import {Container, Dialog, Fab, Loading, SnackbarContext, Section, Subheader, Toolbar} from '-/components/shared';

const nodes = Array(64).fill(true);
const history = {0: []};

export default () => {    
    const [activePixels, setActivePixels] = useState({});
    const [currentColor, setCurrentColor] = useState(undefined);
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
    const [frames, setFrames] = useState([{isThumb: true}]);
    const [gridSpec, setGridSpec] = useState([]);
    const canvas = useRef(null);
    const {show} = useContext(SnackbarContext);
    const panResponder = useMemo(
        () => PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: e => {
                const {nativeEvent} = e;
                const {pageX, pageY: pageYAbs} = nativeEvent;
                const {viewTop, spec} = gridSpec;
                const pageY = pageYAbs - viewTop;
                const nodeIndex = spec.findIndex(node => {
                    const {bottom, left, right, top} = node;


                    return bottom >= pageY && left <= pageX && right >= pageX && top <= pageY;
                });

                console.log(nodeIndex)
            }
        }), [gridSpec]
    );

    const onColorChange = color => {
        setCurrentColor(fromHsv(color));
    };

    const onPixelPress = idx => {
        const frameHistory = history[currentFrameIdx];
        const pixels = cloneDeep(last(frameHistory) || {});
        
        pixels[idx] = currentColor;

        frameHistory.push(pixels);

        setActivePixels(pixels);
    };

    const onUndoPress = () => {
        const frameHistory = history[currentFrameIdx];
        // remove last element in stack
        frameHistory.pop();
        // now get the new last element
        const pixels = cloneDeep(last(frameHistory) || {});

        setActivePixels(pixels);
    };

    const onClearPress = () => {
        history[currentFrameIdx] = [];

        setActivePixels({});
    };

    const onGridLayout = e => {
        const {height: viewHeight, width: viewWidth, y: viewY} = e.nativeEvent.layout;
        const width = viewWidth / 8;
        const height = viewHeight / 8;
        const spec = nodes.map((num, idx) => {
            const row = Math.floor(idx / 8);
            const startPos = idx % 8;
            const left = startPos * width;
            const right = left + width;
            const top = (row * height) + viewY;
            const bottom = top + height;

            return {bottom, left, index: idx, right, top};
        });

        setGridSpec({
            viewTop: viewY,
            spec
        });
    };

    return (
        <Container>
            <Toolbar>
                <IconButton icon="undo" onPress={onUndoPress} />
                <IconButton icon="notification-clear-all" onPress={onClearPress}  />
                <IconButton icon="chevron-left"  />
                <IconButton icon="chevron-right" />
                <IconButton icon="layers-plus" />
                <IconButton icon="image-album" />
                <Paragraph style={styles.frameCount}>1 / 1</Paragraph>
            </Toolbar>
            <View style={styles.checkerboard} {...panResponder.panHandlers} onLayout={onGridLayout} ref={canvas}>
                {nodes.map((num, idx) => {
                    const row = Math.floor(idx / 8);
                    const pixel = activePixels[idx];

                    let pixelStyle;

                    if (idx % 2 === 0 && row % 2 === 0) {
                        pixelStyle = 'even';
                    } else if (idx % 2 !== 0 && row % 2 !== 0) {
                        pixelStyle = 'even';
                    } else {
                        pixelStyle = 'odd';
                    }

                    const style = {...styles[pixelStyle]};

                    if (pixel) {
                        style.backgroundColor = pixel;
                    }

                    return (
                        <TouchableWithoutFeedback                             
                            key={`pixel-${idx}`}
                            onPress={onPixelPress.bind(null, idx)}>
                            <View style={style} />
                        </TouchableWithoutFeedback>
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
    aspectRatio: 1,
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
