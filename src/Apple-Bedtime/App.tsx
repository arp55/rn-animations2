import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Slider from './components/Slider'

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Slider />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    }
})