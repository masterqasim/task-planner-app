import 'react-native-gesture-handler'
import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default class AccountView extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <Text>Account View</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})