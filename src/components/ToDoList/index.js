import React, { Component } from 'react';
import {connect} from 'react-redux';
import Modal from 'react-bootstrap/lib/Modal';
import { Input } from 'antd';

import Calendar from 'react-calendar';
import { Switch } from 'antd';
import {browserHistory, Link} from 'react-router'


import LocaleProvider from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment'
import _ from 'lodash'
import Popconfirm from 'antd/lib/popconfirm'
import Tooltip from 'antd/lib/tooltip'

//Components
import AddReminderComponent from './AddTodoList'

//Action Creator
import {getReminders,changetaskstatus} from '../../redux/actions/todo'
const Search = Input.Search;




class ToDolist extends Component {

    state = {
        addReminder : false,
        editReminder : false,
        todomomentdate  : moment(),
        changeDates : 0,
        date : new Date(),
        todotask : [],
        headerlabel : "Important Tasks",
        remindertask : [],
        taskcompleted : 0,
        count : 0,
        meetingtask : [],
        eventtask : [],
        taskstatus : {},
    
        reminders : [],
        editingData : {}
    }

    componentWillReceiveProps = props =>{
        let meeting = [],count = 0,reminder = [],todo = [],event = [];
        _.map(props.reminders.data,function(o){
            if(o.type == "meeting"){
                meeting.push(o);

            }
            if(o.type == "reminder"){
                reminder.push(o);
            }
            if(o.type == "event"){
                event.push(o);
            }
            if(o.type == "todo"){
                todo.push(o);
            }
        })    
        this.setState({reminders : todo,taskcompleted :count,todotask : todo,meetingtask:meeting,remindertask : reminder,eventtask : event });
    }

    componentDidMount = () =>{
        const {dispatch} = this.props;
        dispatch( getReminders() );
    }
    onChange = date => {

        this.setState({ todomomentdate })
        const {reminders,todomomentdate} = this.state;
        this.setState({todomomentdate : moment(date)})


        let filteredReminders = reminders.filter( reminder =>{
            return moment(moment(reminder.time).format("YYYY-MM-D")).isSame( todomomentdate.format("YYYY-MM-D") )
        })
        return <div>
        {
            filteredReminders.length > 0 && <div>
                {
                    filteredReminders.map( reminder =>{
                        return this.renderReminder( reminder )
                    })
                }
            </div>
        }
        </div>
    }

    onChangeSwitch = (checked,taskid) =>{
        const {taskstatus} = this.state;
        taskstatus[taskid] = checked;
        this.setState({taskstatus})
        const {dispatch} = this.props;
        dispatch( changetaskstatus(taskstatus,taskid) );
    }

    nextDate = () =>{
        const {date} = this.state;
        this.setState({ date : date.add(1, 'days') });
    }

    previousDate = () =>{
        const {date} = this.state;
        this.setState({ date : date.subtract(1, 'days') });
    }

    toggleVisiblity = () =>{
        const {addReminder} = this.state;
        this.setState({ addReminder : !addReminder });
    }

    toggleEditReminder = (item) =>{
       
        const {editReminder} = this.state;
        this.setState({ editReminder : !editReminder, editingData : item });

    }
  

    renderReminder = item =>{

       const {taskstatus} = this.state;
       let taskvalue = false;
       if(item.record_status == "completed") taskvalue = true;
       else taskvalue = false;
       
        return (
            <div className="col-lg-12">
            <i className="material-icons">list</i>

            <p style={{"marginTop":"-28px","marginLeft":"38px"}}>{item.title}</p>
            <div style={{"textAlign":"right","marginTop":"-36px"}}>
            <Switch size="small" defaultChecked = {taskvalue}  onChange={(e) => this.onChangeSwitch(e,item._id)}  style={{"marginTop":"-15px" }} key ="taskstatus" value={taskvalue}/>

            <i className="material-icons cursor-pointer">delete</i>
            <Link  onClick={ () => this.toggleEditReminder(item) }><i className="material-icons cursor-pointer">edit</i></Link>
            <p style={{"marginRight": "100px","marginTop": "-28px"}}>{ moment(item.time).format("HH:mm") }</p>
            </div>
            <hr width="100%" />
            </div>
    
        )
    }



    gettaskslist = (tasktype) =>{

        const {remindertask,headerlabel,meetingtask,eventtask,todotask} = this.state;

        if(tasktype == 'todo'){
            this.setState({reminders : todotask,headerlabel : "Important Tasks"});
        }
        if(tasktype == 'meeting'){
            this.setState({reminders : meetingtask,headerlabel : "Meeting"});
     
        }
        if(tasktype == 'event'){
            this.setState({reminders : eventtask ,headerlabel:"Event"});
     
        }
        if(tasktype == 'reminder'){
            this.setState({reminders : remindertask ,headerlabel:"Reminder"});
     
        }
    }

  
    

    render() {
        const {date,todomomentdate,taskcompleted, headerlabel,addReminder, reminders, editingData, editReminder} = this.state;


        let filteredReminders = reminders.filter( reminder =>{
            return moment(moment(reminder.time).format("YYYY-MM-D")).isSame( todomomentdate.format("YYYY-MM-D") )
        })
    
        return (
            <div className="container background-img2">
                <div className="container-fluid">
                <div className="row container-header-row">
                    <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                        <div className="sidebar-todo">
                            <div>
                                <Search placeholder="Search Tasks" style={{ width: "100%" }}/>

                            </div>
                            <div className = "sidebar-action-todo">

                                <div className="col-sm-12 col-md-12 col-xs-12 col-lg-12" style={{"white-space":"nowrap"}}>
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 no-padding">
                                        <div className="text-center">
                                            <i className="material-icons">list</i>
                                        </div>
                                
                                    </div>
                                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                        <div>
                                            <a onClick = {() => this.gettaskslist('todo')}><p>Important Tasks </p></a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                        <div className="text-center">
                                            <i className="material-icons">alarm</i>
                                        </div>
                                    </div>
                                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                        <a onClick = {() => this.gettaskslist('reminder')}><p>Reminder </p></a>
                                    </div>

                                </div>
                                <div className="col-xs-12 col-lg-12">
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                        <div className="text-center">
                                            <i className="fa fa-users no-padding" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                        <a onClick = {() => this.gettaskslist('meeting')}><p>Meeting </p></a>
                                    </div>

                                </div>
                                <div className="col-xs-12 col-lg-12">
                            
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                        <div className="text-center">
                                            <i className="material-icons">event</i>
                                        </div>
                                    </div>
                                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                    <a onClick = {() => this.gettaskslist('event')}><p>Event </p></a>

                                     </div>

                                </div>
                            </div>
                            <div className="sidebar-add-button">
                                <div className="col-xs-12 col-lg-12" style={{"marginTop":"-30px"}}>
                                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                                    <a style={{"textDecoration": "none"}} onClick={ () => this.toggleVisiblity() }><i className = "fa fa-plus-circle" aria-hidden="true" style={{"fontSize" : "24px"}}></i></a>
                                        </div>
                                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                    <p>Add List</p>
                                    </div>
                                </div>


                            </div>
                            <hr width="79%" />


                            <div className="sidebar-calender">


                        <Calendar
                        onChange={this.onChange}
                        value={this.state.date} 
                      />                        </div>

                        </div>
                     
                        
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                        <div className="sidebar-todo">
                            <h2 className="text-center" style={{"paddingTop":"20px"}}>{headerlabel}</h2>
                            <hr width="90%" />
             

                       
                                                        { 
                                filteredReminders.length > 0 && <div>
                                    {
                                        filteredReminders.map( reminder =>{
                                            return this.renderReminder( reminder )
                                        })
                                    }
                                </div>
                            }
                            { filteredReminders.length === 0 && <p style = {{"paddingLeft" : "20px"}}>No reminder today.</p> }
                            { addReminder && <AddReminderComponent onHide={()=>this.toggleVisiblity()} /> }
                            { editReminder && <AddReminderComponent onHide={(e)=>this.toggleEditReminder({})} {...editingData} edit={true}/> }
                          
                       
                          
                         
                          
                         
                        </div>
                    </div>
                </div>
                </div>

            </div>

        );
    }
}

const mapStateToProps = state =>{
    return { reminders : state.todo.reminders }
}

export default connect(mapStateToProps)(ToDolist);