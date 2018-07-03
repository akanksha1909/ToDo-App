import React, { Component } from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'



import Login from './components/Login'
import ToDolist from './components/ToDoList'




import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'





class App extends Component {
  render() {
    return (
        <Router history={browserHistory} >
          <Route path="/login" component={Login}> </Route>
          <Route path="/todolist" component= {ToDolist}> </Route>
        </Router>
    );
  }
}

export default App;
