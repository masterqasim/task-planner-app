import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ModalPortal } from 'react-native-modals';

import HomeView from './views/HomeView'
import LoadingView from './views/LoadingView'
import LoginView from './views/LoginView'
import SignUpView from './views/SignUpView'
import PlannerView from './views/PlannerView'
import HeatmapView from './views/HeatmapView'
import ShareView from './views/ShareView'
import AccountView from './views/AccountView'
import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyDplLs-QMb6NAvwGzKq1LyqJMO5jOL2pBM",
  authDomain: "task-planner-7a0f2.firebaseapp.com",
  projectId: "task-planner-7a0f2",
  storageBucket: "task-planner-7a0f2.appspot.com",
  messagingSenderId: "858606834868",
  appId: "1:858606834868:web:43b0278d9fed6ac3a073e1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function HomeTabs() {
  return (
    <Tab.Navigator>
        <Tab.Screen name="HomeView" component={HomeView} />
        <Tab.Screen name="PlannerView" component={PlannerView} />
        <Tab.Screen name="HeatmapView" component={HeatmapView} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {/* <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeView} />
        <Tab.Screen name="PlannerView" component={PlannerView} />
        <Tab.Screen name="HeatmapView" component={HeatmapView} />
      </Tab.Navigator> */}
      <Stack.Navigator>
      <Stack.Screen name="LoginView" component={LoginView} />
      <Stack.Screen name="SignUpView" component={SignUpView} />
      <Stack.Screen name="HomeView" component={HomeTabs} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
