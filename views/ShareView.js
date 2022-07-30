import 'react-native-gesture-handler'
import React from 'react'
import {View, Text, StyleSheet,FlatList} from 'react-native'
import { SliderBox } from "react-native-image-slider-box";
import firebase from 'firebase/app'
require('firebase/auth');
require('firebase/database');
// var firebaseConfig = {
//     apiKey: "AIzaSyDplLs-QMb6NAvwGzKq1LyqJMO5jOL2pBM",
//     authDomain: "task-planner-7a0f2.firebaseapp.com",
//     projectId: "task-planner-7a0f2",
//     storageBucket: "task-planner-7a0f2.appspot.com",
//     messagingSenderId: "858606834868",
//     appId: "1:858606834868:web:43b0278d9fed6ac3a073e1"
// };
// // Initialize Firebase

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
  
export default class ShareView extends React.Component {
    state={
        tasks:[],
        images: [
            require('../assets/img1.jpg'),          // ==========================================
            require('../assets/img2.jpg'),           // you can change images of slider from here 
            require('../assets/img3.jpg'),          //<<<<<<<<<< Local images>>>>>>>>>>>>>>>>
          ]
    }
    componentDidMount = ( ) =>{

            
        let userUid = firebase.auth().currentUser.uid;
        firebase.database().ref(userUid).on('value',(data)=>{                  //======================== 
            let task = data.val();                                            //  fetchData from database
            let newTask=[]                                                    //==========================  
            for(var key in task){
                if(task[key].dueDate == new Date().toLocaleDateString()){

                    newTask.push(task[key])
                }
            }
            function compare(a, b) {
                const A = a.dueTime
                const B = b.dueTime;      
                console.log(A,'==',B)           //=======================
                let comparison = 0;             //  sort by due time
                if (A > B) {                    //=======================
                    comparison = 1;
                  } else if (A < B) {
                      comparison = -1;
              }
              if(true){
                  return comparison;
              }
          }
          let sorted = []
          sorted= newTask.sort(compare)
            this.setState({tasks:sorted})  
            newTask=[]
            sorted = []
        })
    }
    render () {
        return (
            <View style={styles.container}>
                <Text style={styles.head}>Today</Text>
              <View>
              {this.state.tasks[0] ? 
               <FlatList
                style={styles.list}
                data={this.state.tasks}
                renderItem={({ item, index }) =>
                <View style={styles.item}>
                    <Text style={styles.time}>{item.dueTime}</Text>
                    <Text style={styles.text}>{item.taskName}</Text>
                </View>
                }/>:
                <Text style={styles.noTask}>
                    Yeah! All done.
                </Text>} 
              </View>
               <View style={{bottom:0,position:'absolute',}}> 

              {/* image slider */}

               <SliderBox                                       
                images={this.state.images}
                sliderBoxHeight={200}
                onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                dotColor="#FFEE58"
                inactiveDotColor="#90A4AE"
                dotStyle={{
                    width: 15,
                    height: 15,
                    borderRadius: 15,
                    marginHorizontal: 10,
                    padding: 0,
                    margin: 0
                }}
                />   
                </View>     
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        width: "100%",
        height:"50%",
        marginTop:10
    },
    item:{
        flexDirection:'row',
        marginHorizontal:20,
        marginTop:5,
    },
    text:{
        // color:'#E9446A',
        marginHorizontal:23,
        width:300,
        fontSize:15
    },
    head:{
        fontSize:30,
        marginTop:35,
        borderBottomColor: "black",
        marginHorizontal:15,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    time:{
        fontSize:15
    },
    noTask:{
        textAlign:'center',
        marginTop:30
    }
})