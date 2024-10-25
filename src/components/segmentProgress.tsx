import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SegmentProgressBarProps {
    percentage: number;
}

const SegmentProgressBar: FC<SegmentProgressBarProps> = ({ percentage }) => {
    const segments = [
        { range: [0, 25], color: '#00ff00' },
        { range: [25, 50], color: '#ffff00' }, // Orange
        { range: [50, 75], color: '#ff9900' },
        { range: [75, 100], color: '#ff0000' }  //red
    ];

    //Depdening on segment it will draw color
    const renderSegments = (): JSX.Element[] => {
        return segments.map((segment, index) => {
            const segmentWidth = Math.min(Math.max(percentage - segment.range[0], 0), segment.range[1] - segment.range[0]);
            return (
                <View
                    key={index}
                    style={[styles.segment, { width: `${segmentWidth}%`, backgroundColor: segment.color }]}
                />
            );
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                {renderSegments()}
            </View>
            {/*   <Text style={styles.percentageText}>{`${percentage}%`}</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 30,
        width: '100%',
        backgroundColor: '#e0e0df',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
    },
    progressBar: {
        flexDirection: 'row',
        height: '100%',
        borderRadius: 5,
        overflow: 'hidden',
    },
    segment: {
        height: '100%',
    },
    percentageText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 30,
    },
});

export default SegmentProgressBar;