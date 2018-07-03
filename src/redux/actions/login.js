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
    'LOCAL_LOGIN',
    'LOCAL_LOGIN_SUCCESS',
    'LOCAL_LOGIN_FAILURE','CLEAR_LOGIN_MESSAGE'
)

function loginSuccess(response) {
    setToken( "token", response.token );
    return { success: true, type: actionTypes.LOCAL_LOGIN_SUCCESS }
}

function loginFailure(error) {
    return { error: error || 'Login failed', type: actionTypes.LOCAL_LOGIN_FAILURE }
}



export function login(user) {
    console.log(user)
    //redux-thunk
    return dispatch => {

        axios.post('http://localhost:5000/user/login', {
            ...user
          })
          .then(function (resp) {
              console.log(resp)
                if( resp.status === 200){
                    return dispatch(loginSuccess(resp.data));
                }else{
                    return dispatch( loginFailure(resp.data.message) )
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

export function clearLoginMessage(){
    return dispatch =>{
        return { type : actionTypes.CLEAR_LOGIN_MESSAGE }
    }
}
