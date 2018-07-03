import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from 'antd/lib/button';
import Modal from 'react-bootstrap/lib/Modal';
import Autocomplete from 'react-google-autocomplete';
import _ from 'lodash';
import moment from 'moment';
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import LocaleProvider from 'antd/lib/locale-provider';
import TimePicker from 'antd/lib/time-picker'
import enUS from 'antd/lib/locale-provider/en_US';
import Input from 'antd/lib/input'
import { Calendar } from 'antd'
import 'antd/dist/antd.css';

//Assets
import addReminderPopup from '../images/add-remainder.png'

import {addoreditreminder} from '../../../redux/actions/todo'


import '../css/style.css'

const { TextArea } = Input;
const Option = Select.Option;




class AddTodoList extends Component {

    constructor( props ){
        super(props);
        this.state = { 
            addtodolist : true,
            inputs : {
                _id : "",
                location : "",
                title : "",
                description : "",
                type : "",
                date : "",
                time : "",
                record_status : "notcompleted"
            },
            momentdate : "",
            momenttime : ""
        }
    }
    componentWillReceiveProps(props){
        const {dispatch} = this.props;
        this.toggleVisiblity();

    }
    componentDidMount = () =>{
        const { _id, title, type, time, location, description,record_status } = this.props;
        const {inputs} = this.state;
        let {momentdate, momenttime} = this.state;
        console.log(this.props)

        if( typeof _id !== "undefined" ) inputs._id = _id;
        if( typeof title !== "undefined" ) inputs.title = title;
        if( typeof type !== "undefined" ) inputs.type = type;

        if( typeof time !== "undefined" ) inputs.date = moment(time).format("YYYY-MM-DD");
        if( typeof time !== "undefined" ) inputs.time = moment(time).format("HH:ss");

        if( typeof time !== "undefined" ) momentdate = moment(time).format("YYYY-MM-DD");
        if( typeof time !== "undefined" ) momenttime = moment(time).format("HH:ss");

        if( typeof location !== "undefined" ) inputs.location = location;
        if( typeof description !== "undefined" ) inputs.description = description;
        if( typeof record_status !== "undefined" ) inputs.record_status = record_status;

        this.setState({ addreminder : true, inputs, momentdate, momenttime });
    }
    onChangeSelect = ( v, type ) =>{
        const {inputs} = this.state;
        inputs[ type ] = v;
        this.setState({ inputs });
    }
    onAdd = () =>{
        const {inputs} = this.state;
        const {dispatch} = this.props;

        if( inputs.title === "" || inputs.type === "" || inputs.date === "" || inputs.time === "" || inputs.description === "" ){
            this.setState({ error : 'All fields are required' });
            return false;
        }        
        this.setState({ loading : true, error : "" }, ()=>{
            let inputObj = {
                _id : inputs._id,
                title : inputs.title,
                type : inputs.type,
                time : moment( inputs.date + " " + inputs.time ).toISOString(),
                location : inputs.location,
                description : inputs.description,
                record_status : inputs.record_status  
            }

            dispatch( addoreditreminder( inputObj ) );
        });
    }

    onChange = (e, type) =>{
        const {inputs} = this.state;
        inputs[ type ] = e.target.value;
        this.setState({ inputs });
    }
    onChangeDate = (dates, dateString, type) =>{
        let {inputs, momentdate, momenttime} = this.state;
        inputs[ type ] = dateString;
        if( type === 'time' ){
            momenttime = dateString;
        }else{
            momentdate = dateString;
        }
        this.setState({ inputs, momentdate, momenttime });
    }

    toggleVisiblity = () =>{
        const {addtodolist} = this.state;
        this.setState({ addtodolist : !addtodolist });
        setTimeout( () =>{ this.props.onHide(); }, 400 );

    }
  

    render() {
        const {inputs,momentdate,momenttime} = this.state;
        let date = "";
        if( momentdate !== "" ){
            date = moment(momentdate)
        }

        let time = "";  
        if( momenttime !== "" ){
            time = moment(momenttime,'HH:mm');
        }
      
 
        return (
            <Modal show={this.state.addtodolist} onHide={this.toggleVisiblity}>
               <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" onClick={ () => this.toggleVisiblity() }>&times;</button>
                        <h5 className="modal-title reminder-modal-title"><img src={addReminderPopup} alt="remainder" title="remainder" /> ADD TASK</h5> 
                        <div className="modal-body reminder-modal-body">
                            <div className="row ">
                                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                    <form>
                                        <div className="textbox-group">
                                            <label>Title<span className="color-red">*</span></label>
                                            <Input placeholder = "Enter Title" value={inputs.title} onChange={(e) => this.onChange( e, "title" )} />
                                        </div>
                                        <div className="textbox-group">
                                            <label>When<span className="color-red">*</span></label>
                                            <LocaleProvider locale={enUS}>
                                                <DatePicker format="YYYY-MM-DD"  value= {date} onChange={(e,d) => this.onChangeDate(e,d,'date')}  style={{ width : '100%' }}  />
                                            </LocaleProvider>
                                        </div>
                                        <div className="textbox-group">
                                            <label>Where</label>
                                            <Autocomplete  style = {{height : "40px" , "border-radius" : "2px",width : "105%", padding :"10px"}}   onPlaceSelected={(place) => {
                                                const {inputs} = this.state;
                                                inputs['location'] = place.formatted_address;
                                                this.setState(inputs)
                                                console.log(place);  }} id="sandbox-container" />
                                            <i className="fa fa-map-marker" style={{ position: 'absolute', bottom: '20px', right: '11px', fontSize: '20px'}}></i>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                    <form>
                                        <div className="textbox-group">
                                            <label>Type<span className="color-red">*</span></label>
                                            <Select style={{"height":"40px"}} value={inputs.type} onChange={(e) => this.onChangeSelect(e, "type")}>
                                                <Option value="reminder">Reminder</Option>
                                                <Option value="meeting">Meeting</Option>
                                                <Option value="todo">ToDo</Option>
                                                <Option value="event">Event</Option>                                                       
                                            </Select>
                                        </div>
                                        <div className="textbox-group">
                                            <label>Time<span className="color-red">*</span></label>
                                            <LocaleProvider locale={enUS}>
                                                <TimePicker value ={time} format="HH:mm" onChange={(e,d) => this.onChangeDate(e,d,'time')} style={{ width : '100%' }}/>
                                            </LocaleProvider>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 textbox-group">
                                    <label>Description<span className="color-red">*</span></label>
                                    <TextArea placeholder="Message to reminder"  value={inputs.description} autosize={{ minRows: 2, maxRows: 6 }} onChange={(e) => this.onChange( e, "description" )}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer reminder-modal-footer">
                        <Button type="primary" className="btn btn-moods-cancel" >CANCEL</Button>
                        <Button type="primary" className="btn btn-moods" onClick={this.onAdd} >ADD TASK</Button> 
                    </div>
                </div>
            </Modal>  
        );
    }
}

const mapStateToProps = state =>{
    return { reminders : state.todo.reminders }
}

export default connect(mapStateToProps)(AddTodoList);
