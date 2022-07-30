import 'react-native-gesture-handler'
import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, LayoutAnimation} from 'react-native'
import * as firebase from 'firebase'

export default class HomeView extends React.Component {
    state = {
        email: "",
        userName: ""
    }

    componentDidMount() {
        const {email, userName} = firebase.auth().currentUser
        this.setState({email, userName})
    }

    signOutUser = () => {
        firebase.auth().signOut()
        this.props.navigation.navigate("HomeView")  
        
    }

    render() {
        LayoutAnimation.easeInEaseOut()
        return (<View style={styles.container}>
            <Text>Hello {this.state.email}!</Text>
            <TouchableOpacity style={{marginTop: 32}}onPress={this.signOutUser}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})