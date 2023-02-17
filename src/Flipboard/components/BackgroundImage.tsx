import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface BgProps {
    top: string;
    bottom: string;
}
interface BgState {
}

export default class BackgroundImage extends Component<BgProps, BgState> {
    state: BgState = {}
    render() {
        const { bottom, top } = this.props
        return (
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.container}>
                    <Text style={{ textAlign: 'justify', fontSize: 24 }}>{top}</Text>
                </View>
                <View style={styles.container}>
                    <Text style={{ textAlign: 'justify', fontSize: 24 }}>{bottom}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    }
})