import 'react-native-gesture-handler'
import React from 'react'
import {View, Button,TouchableOpacity,Image,FlatList,Alert, StatusBar,Text, StyleSheet,TextInput} from 'react-native'
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal, { ModalTitle, ModalContent } from 'react-native-modals';

// import { Ionicons } from '@expo/vector-icons' 
import {Imagebutton} from 'react-native-image-button-text';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import firebase from "firebase/app"

export default class PlannerView extends React.Component {
    state ={
        dueTime: '',
        dueDate: '' ,
        isdate: false,
        isTime: false,
        addTask:true,
        sortOrder:true,
        selectEmoji:true,
        search:'',
        isSearch:false,
        isUpdate:false,
        taskName:'',
        id:'',
        time:'',
        error:'',
        feeling:'',
        tasks:[],
        myText:'',
        ModalVisible:false,
        ModalDelete:false,
        isEdit:false,
        item:{},
        completeBG:'#99ff99'
    }
    componentWillMount = ( ) =>{
        this.fetchData()
    }
    resetState = () =>{
        this.setState({
        dueTime: '',
        dueDate: '' ,
        isdate: false,
        isTime: false,
        addTask:true,
        sortOrder:true,
        sortListByDate:true,
        selectEmoji:true,
        search:'',
        isSearch:false,
        isUpdate:false,
        taskName:'',
        id:'',
        time:'',
        error:'',
        feeling:'',
    })
    }
    fetchData = () =>{
       
        let userUid = firebase.auth().currentUser.uid;
        firebase.database().ref(userUid).on('value',(data)=>{
            // console.log(data,'COMPONENT_DID_MOUNT')              =============================
            let task = data.val();                                  //  fetchData from database
            let newTask=[]                                         //============================ 
            for(var key in task){
                newTask.push(task[key])
            }
            this.setState({tasks:newTask})   
        })
    }
    handleTaskPlanner = () => {

    //>>>>>>>>new task <<<<<<<<<
    let userUid = firebase.auth().currentUser.uid;
      let obj ={
        dueTime:this.state.dueTime ,
        dueDate:this.state.dueDate,  
        taskName:this.state.taskName,
        time:this.state.time,
        feeling:this.state.feeling,
        id:firebase.database().ref(userUid).push(obj).key,
        complete:false
      }
      // >>>>>>> update task <<<<<<<
    if(this.state.isUpdate){
        let obj1 ={
            dueTime:this.state.dueTime ,
            dueDate:this.state.dueDate,
            taskName:this.state.taskName,
            time:this.state.time,
            feeling:this.state.feeling,
            id:this.state.id,
            complete:false,
          } 
     
        firebase.database().ref(userUid).child(obj1.id).update(obj1)      //update task
        this.resetState()
          return;

    }
      if(this.verifyInput(this.state.taskName) && this.state.dueDate != '' && this.state.dueTime != '' && this.state.feeling != '' && this.state.time != ''){
    
        firebase.database().ref(userUid).child(obj.id).set(obj).then((res)=>{      // create new task 
        this.resetState()
        }).catch((error)=>{            
            // console.log(error,'70')  
        })
      }else if(!this.state.addTask){
        this.setState({error:' please fill the compelete form '})
      }else if(this.state.addTask){

          this.setState({addTask:!this.state.addTask})
      }
    //===============================================  
    //   firebase.database().ref(userUid).remove()   >>>>>>>>Delete All Data<<<<<<<<<
    //==============================================
    }
    verifyInput = (inputField)=> {
        if (!inputField)
            return false;    // accept only alphabets and  digits for task name
        return new RegExp(/^[a-z A-Z]+[a-z A-Z 0-9_]+$/g).test((inputField.toString()).trim())
    }
    showDatePicker = () => {
        this.setState({isdate:true})
      };
      showTimePicker = () => {
        this.setState({isTime:true})
      };
      hideDatePicker = () => {
        this.setState({isTime:false})
        this.setState({isdate:false})
      };
     
      handleConfirm = date => {   //DUE DATE HANDLER
        this.setState({dueDate:date.toLocaleDateString()})
        this.hideDatePicker();
      }
      handleConfirm1 = date => { //DUETIME HANDLER
        this.setState({dueTime:date.toLocaleTimeString()})
        this.hideDatePicker();
      };
      sortList = ()=>{
          let order = this.state.sortOrder  
          function compare(a, b) {
              const A = a.taskName.toUpperCase();
              const B = b.taskName.toUpperCase();        
              let comparison = 0;
              if (A > B) {
                  comparison = 1;
                } else if (A < B) {                    //sort list by Alphabets
                    comparison = -1;
            }
            if(order){
                return comparison;
            }else{
                return comparison * -1;
            }
        }
        let sorted = []
        sorted= this.state.tasks.sort(compare)
        this.setState({tasks:sorted})
        this.setState({sortOrder:!this.state.sortOrder})
      }
      sortListByDate = ()=>{

        let order = this.state.sortListByDate
        function compare(a, b) {
            const A = new Date(a.dueDate)
            const B =  new Date(b.dueDate);      
            console.log(A,'==',B)  
            let comparison = 0;
            if (A > B) {
                comparison = 1;
              } else if (A < B) {
                  comparison = -1;                      //sort list by date
          }
          if(order){
              return comparison;
          }else{
              return comparison * -1;
          }
      }
      let sorted = []
      sorted= this.state.tasks.sort(compare)
      this.setState({tasks:sorted})
      this.setState({sortListByDate:!this.state.sortListByDate})
    }
      handleEdite = (item)=>{  // edit selected item from database
        this.setState({
            taskName:item.taskName,dueDate:item.dueDate,
            dueTime:item.dueTime,time:item.time,feeling:item.feeling,
            isUpdate:true,addTask:!this.state.addTask,id:item.id,item:{}
        })
        this.setState({ModalVisible:false,})
      } 
      handleDelete = (item)=>{
          let userUid = firebase.auth().currentUser.uid;
          firebase.database().ref(userUid).child(item.id).remove()      // Delete selected item from database
          this.setState({ModalDelete:false})
          this.setState({item:{}})
      } 
     handleComplete = (item)=>{
        let comp = !item.complete 
        let userUid = firebase.auth().currentUser.uid;               // Update complete
        firebase.database().ref(userUid).child(item.id).update({'complete':comp})
     }
    render () {
        // console.log(this.state)
        const link = this.state.feeling
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          };
        return (
            <View style={styles.container}>
                <Modal visible={this.state.ModalVisible}>
                <ModalContent>
                    <Text style={{marginBottom:10}}>Are you sure you want to edit this task ?</Text>
                    <Text style={{marginBottom:10,color:'#009688'}}>{this.state.item.taskName}</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=>{this.setState({ModalVisible:false})}}>
                            <Text style={{color:'blue'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.handleEdite(this.state.item)}}>
                            <Text style={{color:'blue'}}>Ok</Text>
                        </TouchableOpacity>   
                    </View>
                </ModalContent>
                </Modal>
                <Modal visible={this.state.ModalDelete}>
                <ModalContent>
                    <Text style={{marginBottom:10}}>Are you sure you want to Delete this task ?</Text>
                    <Text style={{marginBottom:10,color:'#009688'}}>{this.state.item.taskName}</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=>{this.setState({ModalDelete:false})}}>
                            <Text style={{color:'blue'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.handleDelete(this.state.item)}}>
                            <Text style={{color:'blue'}}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </ModalContent>
                </Modal>
               {!this.state.addTask &&<View>

                {/* ADD NEW TASK FORM START */}

                <StatusBar barStyle="light-content"></StatusBar>
                <Image source={require('../assets/loginHeader.png')} style={{marginTop: -270, marginLeft: -50}}></Image>
                <Image source={require('../assets/loginFooter.png')} style={{position: "absolute", bottom:  -325, right: -255}}></Image>
                <View style={styles.Title}> 
                    <Text> Add New Task</Text>
                </View>
                <View style={styles.Title}> 
                    <Text style={{color:'red'}}> {this.state.error}</Text>
                </View>                
                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Task Name</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none" 
                            placeholder='Task name'
                            onChangeText={taskName => this.setState({taskName})}
                            value={this.state.taskName}>
                        </TextInput>
                    </View>
                    <View>
                        <Text style={styles.inputTitle}>How long will this task take to</Text>
                        <View>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none" 
                            onChangeText={time => this.setState({time})}
                            placeholder='Hours'
                            value={this.state.time}
                            keyboardType={'numeric'}
                        >
                        </TextInput> 
                        </View>
                        <View>
                            <Text style={styles.inputTitle}>When is this task due ?</Text>
                            <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
                                 <TouchableOpacity style={styles.select} onPress={this.showDatePicker}>
                                    <Text style={{color: "#FFF", fontWeight: "500"}}>select date</Text>
                                 </TouchableOpacity>
                                 {this.state.dueDate ? <Text>{this.state.dueDate}</Text> :<Text>mm/dd/yy</Text>}
                                 <TouchableOpacity style={styles.select} onPress={this.showTimePicker}>
                                    <Text style={{color: "#FFF", fontWeight: "500"}}>select Time</Text>
                                 </TouchableOpacity>
                                 {this.state.dueTime ? <Text>{this.state.dueTime}</Text>:<Text>00:00:00</Text>}
                            </View>

                            {/* <DateTimePickerModal
                                isVisible={this.state.isTime}
                                mode="time"
                                onConfirm={this.handleConfirm1}
                                onCancel={this.hideDatePicker}
                            />
                            <DateTimePickerModal
                                isVisible={this.state.isdate}
                                mode="date"
                                onConfirm={this.handleConfirm}
                                onCancel={this.hideDatePicker}
                            /> */}
                        </View>
                        <View>
                            <Text style={styles.inputTitle}>How do you feel about this task ?</Text>
                            
                            {this.state.selectEmoji ?
                            <View style={{flexDirection:'row',marginHorizontal:10}}>
                                <TouchableOpacity onPress={()=>this.setState({ feeling:'exited',selectEmoji:false})}>
                                 <Image 
                                    source={require('../assets/exited.png')} 
                                    style={{height:42 ,width:42,marginTop:3}} 
                                ></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.setState({ feeling:'happy',selectEmoji:false})}>
                                 <Image 
                                    source={require('../assets/happy.png')} 
                                    style={{height:42 ,width:42,marginRight:2,marginTop:3}} 
                                ></Image>
                                </TouchableOpacity>
                                 <TouchableOpacity onPress={()=>this.setState({ feeling:'neutral',selectEmoji:false})}>
                                 <Image source={require('../assets/neutral.png')}
                                    style={{height:50 ,width:50,}}
                                ></Image>           
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.setState({ feeling:'bored',selectEmoji:false})}>
                                 <Image 
                                    source={require('../assets/bored.png')}
                                    style={{height:42 ,width:42,marginTop:3}} 
                                    ></Image>     
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.setState({ feeling:'procrastinating',selectEmoji:false})}>
                                 <Image 
                                    source={require('../assets/procrastinating.png')} 
                                    style={{height:42 ,width:42,marginLeft:2,marginTop:3}} 
                                ></Image>                              
                                </TouchableOpacity>                            
                            </View> :
                            <View>
                                <TouchableOpacity onPress={()=>this.setState({ selectEmoji:true})}>
                                {this.state.feeling == 'happy' && <Image 
                                    source={require('../assets/happy.png')}
                                    style={{height:42 ,width:42,marginRight:2,marginTop:3}} 
                                    >
                                </Image>}
                                {this.state.feeling == 'exited' && <Image 
                                    source={require('../assets/exited.png')}
                                    style={{height:42 ,width:42,marginTop:3}} 
                                    >
                                </Image>}
                                {this.state.feeling == 'neutral' && <Image 
                                    source={require('../assets/neutral.png')}
                                    style={{height:50 ,width:50}} 
                                    >
                                </Image>}
                                {this.state.feeling == 'bored' && <Image 
                                    source={require('../assets/bored.png')}
                                    style={{height:42 ,width:42,marginTop:3,marginRight:1}} 
                                    >
                                </Image>}
                                {this.state.feeling == 'procrastinating' && <Image 
                                    source={require('../assets/procrastinating.png')}
                                    style={{height:42 ,width:42,marginRight:2,marginTop:3}} 
                                    >
                                </Image>}     
                                </TouchableOpacity>
                            </View>
                            }

                        </View>
                    </View>
                </View>
                 </View>}
                    {/* ADD NEW TASK FORM ENDS ^*/}
                    {/* TASK LISTS START */}
                 {this.state.addTask && 
                 <View>
                      <Image source={require('../assets/loginFooter.png')} style={{position: "absolute", bottom:  -325, right: -255}}></Image>
               
                        <View style={styles.Title}> 
                            <Text>Task Activity Planner</Text>
                        </View>
                        <View style={{flexDirection: 'row',justifyContent: "space-between",marginHorizontal:8,}}>
                            <TouchableOpacity onPress={()=>this.setState({ isSearch:!this.state.isSearch,search:''})}>
                              {/* <Ionicons name="ios-funnel" size={24} color='#ccc'  /> */}
                              <Text>Filter</Text>
                            </TouchableOpacity>

                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity 
                                    onPress={this.sortListByDate}
                                    style={{flexDirection: 'row',}}
                                >
                                    {/* <Ionicons name="ios-arrow-round-up" size={27}  style={{}} /> */}
                                    {/* <Ionicons name="ios-arrow-round-down" size={27}  style={{}} /> */}
                                 {!this.state.sortListByDate 
                                    ?  <Text>up</Text> 
                                    :  <Text>down</Text> }   
                                {/* <Ionicons name="ios-calendar" size={27}  style={{marginRight:8,}} /> */}
                                <Text>&#9777;</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.sortList}>
                                {!this.state.sortOrder ? <Image 
                                    source={require('../assets/sort_za.png')} 
                                    style={{height:20 ,width:20, marginTop:2,}} 
                                ></Image>:
                                <Image 
                                    source={require('../assets/sort_az.png')} 
                                    style={{height:20 ,width:20,marginTop:2 }} 
                                ></Image>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                        {this.state.isSearch ?   
                        // SEARCH BY MOODS
                            <View style={{flexDirection:'row',marginHorizontal:10}}>
                                <TouchableOpacity onPress={()=>this.setState({ search:'exited',isSearch:false})}>
                                 <Image 
                                    source={require('../assets/exited.png')} 
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:3}} 
                                ></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.setState({ search:'happy',isSearch:false})}>
                                 <Image 
                                    source={require('../assets/happy.png')} 
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:1}} 
                                ></Image>
                                </TouchableOpacity>
                                 <TouchableOpacity onPress={()=>this.setState({ search:'neutral',isSearch:false})}>
                                 <Image source={require('../assets/neutral.png')}
                                    style={{height:50 ,width:50,}}
                                ></Image>           
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.setState({ search:'bored',isSearch:false})}>
                                 <Image 
                                    source={require('../assets/bored.png')}
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:1}} 
                                    ></Image>     
                                </TouchableOpacity> 
                                <TouchableOpacity onPress={()=>this.setState({ search:'procrastinating',isSearch:false})}>
                                 <Image 
                                    source={require('../assets/procrastinating.png')} 
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:3}} 
                                ></Image>                              
                                </TouchableOpacity>                               
                            </View> :
                            <View>
                                <TouchableOpacity onPress={()=>this.setState({ isSearch:true})}>
                                {this.state.search == 'happy' && <Image 
                                    source={require('../assets/happy.png')}
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:1}} 
                                    >
                                </Image>}
                                {this.state.search == 'exited' && <Image 
                                    source={require('../assets/exited.png')}
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:3}} 
                                    >
                                </Image>}
                                {this.state.search == 'neutral' && <Image 
                                    source={require('../assets/neutral.png')}
                                    style={{height:50 ,width:50}} 
                                    >
                                </Image>}
                                {this.state.search == 'procrastinating' && <Image 
                                    source={require('../assets/procrastinating.png')}
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:1}} 
                                    >
                                </Image>}
                                {this.state.search == 'bored' && <Image 
                                    source={require('../assets/bored.png')}
                                    style={{height:42 ,width:42,marginTop:3,marginLeft:3}} 
                                    >
                                </Image>}     
                                </TouchableOpacity>
                            </View>
                            }
                        </View>
                        <FlatList
                        style={styles.list}
                        data={this.state.tasks}
                        renderItem={({ item, index }) =>
                        <GestureRecognizer 
                        onSwipeLeft={(state) => this.setState({item},this.setState({ModalDelete:true}))}
                        onSwipeRight={(state) => this.setState({item},this.setState({ModalVisible:true}))}
                        config={config}                        
                        >
                             <TouchableOpacity  style={{backgroundColor:item.complete ? this.state.completeBG :'white'}} onPress={()=>{this.handleComplete(item)}}>
                              {this.state.search == '' ?                                    
                                    <View>
                                        <View style={styles.listItemCont}>
                                    <View>
                                        <Text style={styles.listItem}>
                                        {item.taskName}
                                        </Text>
                                        <View style={{flexDirection:'row',}}>
                                            { item.dueTime&& <Text style={styles.nestedItem}>{item.dueTime}</Text>}
                                            { item.dueDate && <Text style={styles.nestedItem1}>{item.dueDate}</Text>}
                                        </View>
                                    </View>
                                        <View style={{flexDirection:'row',}}>
                                            <TouchableOpacity >
                                                {item.feeling == 'happy' && <Image 
                                                    source={require('../assets/happy.png')}
                                                    style={{height:42 ,width:42,marginTop:3,marginRight:3}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'exited' && <Image 
                                                    source={require('../assets/exited.png')}
                                                    style={{height:42 ,width:42,marginTop:3,marginRight:3}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'neutral' && <Image 
                                                    source={require('../assets/nutral.png')}
                                                    style={{height:43 ,width:43,marginRight:3,marginTop:2}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'procrastinating' && <Image 
                                                    source={require('../assets/procrastinating.png')}
                                                    style={{height:42 ,width:42,marginTop:3,marginRight:3}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'bored' && <Image 
                                                    source={require('../assets/bored.png')}
                                                    style={{height:42 ,width:42,marginTop:3,marginRight:3,marginLeft:1}} 
                                                    >
                                                </Image>}     
                                            </TouchableOpacity>                                     
                                        </View>   
                                    </View>
                                <View style={styles.hr} />
                                    </View>
                                   :
                                   <View>
                                       {this.state.search == item.feeling &&
                                        <View>
                                            <View style={styles.listItemCont}>
                                    <View>
                                        <Text style={styles.listItem}>
                                        {item.taskName}
                                        </Text>
                                        <View style={{flexDirection:'row',}}>
                                            { item.dueTime&& <Text style={styles.nestedItem}>{item.dueTime}</Text>}
                                            { item.dueDate && <Text style={styles.nestedItem1}>{item.dueDate}</Text>}
                                        </View>
                                    </View>
                                        <View style={{flexDirection:'row',}}>
                                            <TouchableOpacity >
                                                {item.feeling == 'happy' && <Image 
                                                    source={require('../assets/happy.png')}
                                                    style={{height:42 ,width:42,marginTop:3,marginLeft:1}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'exited' && <Image 
                                                    source={require('../assets/exited.png')}
                                                    style={{height:42 ,width:42,marginTop:3,marginLeft:1}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'neutral' && <Image 
                                                    source={require('../assets/nutral.png')}
                                                    style={{height:45 ,width:45}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'procrastinating' && <Image 
                                                    source={require('../assets/procrastinating.png')}
                                                    style={{height:42 ,width:42}} 
                                                    >
                                                </Image>}
                                                {item.feeling == 'bored' && <Image 
                                                    source={require('../assets/bored.png')}
                                                    style={{height:42 ,width:42}} 
                                                    >
                                                </Image>}     
                                            </TouchableOpacity>                                     
                                        </View>   
                                    </View>
                                <View style={styles.hr} />
                                        </View>
                                       }
                                   </View> 
                                }
                            </TouchableOpacity>
                            </GestureRecognizer>
                        }
                        />
                                    {/* TASK LISTS ENDS */}
                </View>}
                <TouchableOpacity style={styles.button} onPress={this.handleTaskPlanner}>
                     {!this.state.addTask ?
                    <Text style={{color: "#FFF", fontWeight: "500"}}>Add Task To Planner</Text>:
                    <Text style={{color: "#FFF", fontWeight: "500"}}>Add New Task</Text>}
                 </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:50,
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase",
        marginTop:10,
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    Title: {
        fontSize: 20,
        alignItems: "center",
        marginBottom:10,
    },
    headerText: {  
        fontSize: 20,  
        textAlign: "center",  
        margin: 10,  
        fontWeight: "bold"  
    },
    TextInputStyle: {  
        textAlign: 'center',  
        height: 40,  
        borderRadius: 10,  
        borderWidth: 2,  
        borderColor: '#009688',  
        marginBottom: 10  
    },
    button: {
        marginHorizontal: 50,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 52,
        width:300,
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
        bottom:0,
        marginBottom: 36
    },
    timePicker:{
        marginTop:20,
    },
    select:{
        marginHorizontal: 10,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        padding:8,
        marginTop:7,
        marginBottom:7
    },
    list: {
        width: "100%",
        height:"70%"
      },
      listItem: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
        width:230
      },
      hr: {
        height: 1,
        marginTop:3,
        backgroundColor: "#ccc",
        marginLeft:10,
        marginRight:10
      },
      listItemCont: {
        
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal:15,
        display:'flex',

      },
      nestedItem:{
          marginRight:10,
          fontSize: 13,
          color:'#009688'
      },
      nestedItem1:{
          marginRight:10,
          fontSize: 13,
          color:'#E9446A'
      },
      Error:{
          fontSize:18,
          color:'red',
          justifyContent:'center'
      }
})