import { actionTypes } from '../actions/login'
const { 
    LOCAL_LOGIN_SUCCESS, LOCAL_LOGIN_FAILURE,CLEAR_LOGIN_MESSAGE
} = actionTypes;

const initialState = {
    signin : {
        error : "",
        success : "",
        redirect : false
    }
}

export default function login(state = initialState, action) {
    switch(action.type) {
        case LOCAL_LOGIN_SUCCESS:
            return { ...state, signin : { redirect : true, error : "" } }
        case LOCAL_LOGIN_FAILURE:
            return { ...state, signin : { error: action.error, success : "", message : "" } }
        case CLEAR_LOGIN_MESSAGE:
            return { ...state,  signin : { error: '', success : "", message : "" } }
        default:
            return state
    }
}