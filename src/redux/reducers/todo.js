import { actionTypes } from '../actions/todo'
const { 
    ADD_REMINDER_SUCCESS, ADD_REMINDER_FAILURE,EDIT_REMINDER_SUCCESS,REMINDERS_DATA,TASK_STATUS_SUCCESS,TASK_STATUS_FAILURE
} = actionTypes;

const initialState = {
    reminders : {
        data : [],
        success : "",
        error : "",
        loading : true
    }
}

export default function todo(state = initialState, action) {
    switch(action.type) {
        case ADD_REMINDER_SUCCESS:
        return { ...state, reminders : { ...state.reminders, data : [ ...state.reminders.data, action.data ], success : action.success, error : "" } }
        case ADD_REMINDER_FAILURE:
            return { ...state, signin : { error: action.error, success : "", message : "" } }
        case REMINDERS_DATA :
            return {...state,reminders : {...state.reminders,data : action.data, success : action.success ,error :""}}
        case TASK_STATUS_SUCCESS : 
            return {...state,
                reminders :{
                    ...state.reminders,
                    data : state.reminders.data.map(reminder=>{
                        if(action.data.reminderid == reminder._id){
                            reminder.record_status = action.data.record_status;
                        }
                        return {...reminder}
                    }),
                    success : action.success, 
                    error : "" 
                }}
        case EDIT_REMINDER_SUCCESS : 
        return { 
            ...state, 
            reminders : { 
                ...state.reminders, 
                data : state.reminders.data.map( reminder =>{
                    if( action.data._id === reminder._id ){
                        return { ...action.data }
                    }

                    return { ...reminder }
                }), 
                success : action.success, 
                error : "" 
            } 
        }
        default:
            return state
    }
}