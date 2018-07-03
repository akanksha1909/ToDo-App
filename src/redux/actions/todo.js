import generateActionTypes from '../utils/generateActionTypes'
import { setToken, removeToken} from '../constants/Api'
import axios from 'axios'
import config from '../../config'
import {browserHistory} from 'react-router';
import _ from 'lodash'
import Moment from 'moment'
import Modal from 'antd/lib/modal'

const confirm = Modal.confirm;

export const actionTypes = generateActionTypes(
    'ADD_REMINDER_SUCCESS',
    'ADD_REMINDER_FAILURE',
    'REMINDERS_DATA','REMINDERS_ERROR','TASK_STATUS_SUCCESS','TASK_STATUS_FAILURE','EDIT_REMINDER_SUCCESS'

)

function getErrorMessage( err, defaultMessage = "Unable to get the data from server" ){
    console.log( err );
    return ( typeof err.response !== "undefined" && typeof err.response.data !== 'undefined' && typeof err.response.data.error !== 'undefined' ) ?
        err.response.data.error : defaultMessage;
}




export function addoreditreminder(inputs) {
    console.log(inputs)
    return dispatch => {
    axios.post('http://localhost:5000/reminder/addoredit', {
            ...inputs
          },{
                headers: { "authorization": localStorage.getItem('token') }
              
          })
          .then(function (resp) {
                if(inputs._id != ""){
                    return dispatch({ data : resp.data.data, success : resp.data.message, type: actionTypes.EDIT_REMINDER_SUCCESS })
                }else{
                    return dispatch({ data : resp.data.data, success : resp.data.message, type: actionTypes.ADD_REMINDER_SUCCESS })
                }
        })
          .catch(function (err) {
                try{
                    if (err.response.status === 401 || err.response.status === 403)
                        return browserHistory.push('/login')
                }catch(e){

                }
          });
    }
}

export function getReminders(){
    //redux-thunk
    return dispatch => {
        axios.get('http://localhost:5000/reminder/getreminder',
        {
            headers: {
                "authorization": localStorage.getItem('token')            }
        })
        .then(function (resp) {

            return dispatch( { data : resp.data.data, type: actionTypes.REMINDERS_DATA } )
        })
        .catch(function (err) {
            if( err.response ){
                if (err.response.status === 401 || err.response.status === 403)
                    return dispatch({ error: getErrorMessage(err), type: actionTypes.REMINDERS_ERROR })
            }
        });
    }
}

export function changetaskstatus(taskstatus,reminderid){
    console.log(taskstatus[reminderid])
    if(taskstatus[reminderid] == true) taskstatus = "completed";
    else taskstatus = "notcompleted";
    return dispatch => {
        axios.get('http://localhost:5000/reminder/changetaskstatus/' + taskstatus + '/' + reminderid,
        {
            headers: {
                "authorization": localStorage.getItem('token')            }
        })
        .then(function (resp) {
            return dispatch( { data : resp.data.data, type: actionTypes.TASK_STATUS_SUCCESS } )
        })
        .catch(function (err) {
            if( err.response ){
                if (err.response.status === 401 || err.response.status === 403)
                    return dispatch({ error: getErrorMessage(err), type: actionTypes.TASK_STATUS_FAILURE })
            }
        });
    }
}