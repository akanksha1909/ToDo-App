import { combineReducers } from 'redux'
import login from './login'
import todo from './todo'

export default combineReducers({
  	login,todo
});