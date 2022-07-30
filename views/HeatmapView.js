import 'react-native-gesture-handler'
import React from 'react'
import PureChart from 'react-native-pure-chart';
import {View, Text, StyleSheet,TouchableOpacity,Image,StatusBar} from 'react-native'
import firebase from "firebase/app"
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons' 
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class HeatmapView extends React.Component {
    state={      // <<<<<<<<<<<<<<<<<< STATE >>>>>>>>>>>>>>>>>>>>>>>
        task:[],
        data:[],
        happy:{x:new Date().toDateString(),y:0},
        exited:{x:new Date().toDateString(),y:0},
        neutral:{x:new Date().toDateString(),y:0},
        procrastinating:{x:new Date().toDateString(),y:0},
        bored:{x:new Date().toDateString(),y:0},
        happyNum:0,
        searchDate: new Date().toLocaleDateString(),
        isSearchData:false,
        ShowAll:false
    }
    componentDidMount = ( ) =>{
        this.fetchData()
    }
    add = (a,b)=>{
        console.log(a+b)
        return a+b
    }
    handleConfirm = date => {
        this.setState({searchDate:date.toLocaleDateString(),isSearchData:!this.state.isSearchData},()=>{
            this.fetchData()
        })
      }
      ShowAllData = date => {
        this.setState({ShowAll:true},()=>{
            this.fetchData()
        })
      }
    fetchData = () =>{
              
        let userUid = firebase.auth().currentUser.uid;
        firebase.database().ref(userUid).on('value',(data)=>{
            let task = data.val();
            let hnum =[];                   //==========================
            let exnum =[];                  //  fetchData from database
            let nnum=[];                    //==========================
            let pnum=[];
            let bnum=[];
            for(var key in task){
                
                let obj;
                if(task[key].dueDate == this.state.searchDate || this.state.ShowAll){
                    if(task[key].feeling == 'happy'){
                        hnum.push(Number(task[key].time))
                    }else if(task[key].feeling == 'exited'){
                        exnum.push(Number(task[key].time))                  //=================================
                    }else if(task[key].feeling == 'neutral'){               // manupulating data for dynamic graph 
                        nnum.push(Number(task[key].time))                   //================================
                    }else if(task[key].feeling == 'procrastinating'){
                        pnum.push(Number(task[key].time))
                    }else if(task[key].feeling == 'bored'){               
                        bnum.push(Number(task[key].time))
                    }
                }
            }

            // object of each moode
            let hobj={
                x:' ',
                y: hnum.reduce(function(a, b){
                    return a + b;
                }, 0),
                color: 'green'
            }
            let exobj={
                x:' ',
                y: exnum.reduce(function(a, b){
                    return a + b;
                }, 0)
            }
            let nobj={
                x:' ',
                y: nnum.reduce(function(a, b){
                    return a + b;
                }, 0)
            }
            let pobj={
                x:' ',
                y: pnum.reduce(function(a, b){
                    return a + b;
                }, 0)
            }
            let bobj={
                x:' ',
                y: bnum.reduce(function(a, b){
                    return a + b;
                }, 0)
            }

            this.setState({exited:exobj})
            this.setState({happy:hobj})
            this.setState({neutral:nobj})
            this.setState({procrastinating:pobj})
            this.setState({bored:bobj})
            hnum =[];
            nnum =[];
            pnum =[];
            bnum =[];
            exnum =[];
        })
    }
    render () {
        console.log(this.state)
        let sampleData = [
            {
              seriesName: 'series1',
              data: [
                // this.state.happy,
                this.state.exited,
                // this.state.neutral,
                // this.state.procrastinating,
                // this.state.bored
              ],
              color: '#009900'
            },
            {
              seriesName: 'series2',
              data: [
                this.state.happy,
              ],
              color: 'orange'
            },
            {
              seriesName: 'series2',
              data: [
                this.state.neutral,
              ],
              color: '#ccc'
            },
            {
              seriesName: 'series2',
              data: [
                this.state.bored
              ],
              color: 'red'
            },
            {
              seriesName: 'series2',
              data: [
                this.state.procrastinating,
              ],
              color: '#4275f5'
            }
           
          ]
        return (
            <View style={{flex:1}}>
                          <StatusBar hidden={true} />
                <View>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={styles.header}>Your Moods</Text>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>this.ShowAllData()}>
                                <Image 
                                source={require('../assets/showAll.png')} 
                                style={{height:23 ,width:23,marginTop:10 ,marginRight:9}} 
                            ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            onPress={()=>this.setState({ isSearchData:!this.state.isSearchData,ShowAll:false})} 
                            style={{marginTop:9 ,marginRight:5}}>
                                <Ionicons name="ios-search" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DateTimePickerModal
                        isVisible={this.state.isSearchData}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={()=>{this.setState({isSearchData:!this.state.isSearchData})}}
                    />
                    <Text style={styles.head}>The time you need to spend to complete your whole schedule categorised by mood</Text>
                </View >
                <View style={styles.hr}/>
              <View  style={styles.container}>
              <View style={{marginHorizontal:2}}>
                <View style={{flexDirection:'row' ,justifyContent:'space-evenly',width:'100%',marginBottom:1}}> 
                    <Text style={{marginHorizontal:5}}>Exited</Text>
                    <Text style={{marginHorizontal:4}}>Happy</Text>
                    <Text style={{marginHorizontal:4}}>Nutral</Text>
                    <Text style={{marginHorizontal:4}}>bored</Text>
                    <Text style={{marginHorizontal:5,width:50}}>procrastinating</Text>
                </View>
                </View>
                <View>
                <PureChart 
                height={330}
                width={'100%'}
                defaultColumnWidth={300}
                data={sampleData}
                type="bar"
                numberOfYAxisGuideLine={10}
                highlightColor="white"
                />
                </View>
                <View style={{flexDirection:'row' ,justifyContent:'space-evenly',width:'100%',marginTop:0,marginBottom:4}}>
                    <Image 
                        source={require('../assets/exited.png')}
                        style={{height:40 ,width:40,marginTop:3}} 
                        >
                    </Image>
                    <Image 
                        source={require('../assets/happy.png')}
                        style={{height:40 ,width:40,marginTop:3,marginLeft:10}} 
                        >
                    </Image> 
                    <Image 
                        source={require('../assets/neutral.png')}
                        style={{height:45 ,width:45}} 
                        >
                    </Image>
                    <Image 
                        source={require('../assets/bored.png')}
                        style={{height:40 ,width:40,marginTop:3,}} 
                        >
                    </Image> 
                    <Image 
                    source={require('../assets/procrastinating.png')}
                    style={{height:40 ,width:40,marginTop:3}} 
                    >
                    </Image>
 
                </View>
              </View>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        bottom:0,
        position:'absolute'
    },
    head:{
        fontSize:16,
        width:300,
        marginBottom:15,
        marginHorizontal:20,
    },
    header:{
        fontSize:30,
        marginBottom:13,
        marginTop:2,
        marginHorizontal:15
    },      
    hr: {
        height: 1,
        marginTop:1,
        backgroundColor: "black",
        marginHorizontal:15,
        width:350,
        marginBottom:20
      },
})

PureChart.propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    color: PropTypes.string,
    height: PropTypes.number,
    size: PropTypes.number,
    }
    PureChart.defaultProps = {
    color: '#297AB1',
    height:400,
    size:600
    }