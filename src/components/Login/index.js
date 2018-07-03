import React, {Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router' 
import _ from 'lodash'
import config from '../../config'
import notification from 'antd/lib/notification'


import './css/style.css'

import {login,clearLoginMessage} from '../../redux/actions/login'




class Login extends Component {

    constructor( props ){
        super(props);
        this.state = {
            inputs :{
                phone :"",
                countryprefix : '+213',
                code : ''
            },
            error : ''

        }
        
    }

    componentWillReceiveProps(props){
        const {dispatch} = this.props;
        if( props.signin.redirect === true ){
            browserHistory.push('/todolist');
        }
        if( typeof props.signin.error !== 'undefined' && props.signin.error !== "" ){
            this.setState({error: props.signin.error})
            notification['error']({
                message     : 'Login',
                description : props.signin.error,
                placement   : 'bottomRight',
                duration    : 10
            });
            // dispatch( clearLoginMessage() );
        }
    }
    componentDidMount = () =>{
        
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        
        window.fbAsyncInit = function() {
            window.FB.init({
              appId      : '137276817141255',
              cookie     : true,  // enable cookies to allow the server to access the session
              xfbml      : true,  // parse social plugins on this page
              version    : 'v1.0' // use version 2.1
            });
        };

        (function() {
            var e = document.createElement("script");
            e.type = "text/javascript";
            e.async = true;
            e.src = "https://apis.google.com/js/client:platform.js?onload=gPOnLoad";
            var t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(e, t)
        })();  

        // const {dispatch} = this.props;
        // let _this = this;
        // if( typeof window.AccountKit === 'undefined' ){
        //    (function(d, s, id) {
        //         var js, fjs = d.getElementsByTagName(s)[0];
        //         if (d.getElementById(id)) return;
        //         js = d.createElement(s); js.id = id;
        //         js.src = "https://sdk.accountkit.com/en_US/sdk.js";
        //         fjs.parentNode.insertBefore(js, fjs);
        //     }(document, 'script', 'facebook-jssdk'));
            
        //     setTimeout(function(){
        //         window.AccountKit.init({
        //             appId: '137276817141255',
        //             state: "ab224354dfdcd",
        //             version:'v1.0',
        //             fbAppEventsEnabled:true,
                   
        //             debug : true
        //         });
        //     },5000); 
        // }

    }
    fetchDataFacebook = () => {
        let data = {type : 'facebook',data:{} };
        let _this = this;
        window.FB.api('/me', function(user) {
            alert( 'Successful login for: ' + user.name );
            data.data = user;
            _this.onSocialLogin(data);
            return;

        });
    }

    onInputChange = (e, type) =>{
        const {inputs} = this.state;
        inputs[ type ] = e.target.value;
        this.setState({ inputs });
    }
    statusChangeCallback(response) {
        if (response.status === 'connected') {
            alert( "Connected to facebook. Retriving user from fb" );
            // Logged into your app and Facebook.
            this.fetchDataFacebook();
        } else if (response.status === 'not_authorized') {
            console.log('Import error', 'Authorize app to import data', 'error')
        } else {
            console.log('Import error', 'Error occured while importing data', 'error')
        }
    }

    facebookLogin = () => {
        
        window.FB.login(function(resp){
            this.statusChangeCallback(resp);
        }.bind(this));
    }

        //Triggering login for google
        googleLogin = () => {
            let response = null;
            window.gapi.auth.signIn({
                callback: function(authResponse) {
                    this.googleSignInCallback( authResponse )
                }.bind( this ),
                clientid: '387600421093-1o2g7ei4fotlqn9msvh50mh3ulqhfbne.apps.googleusercontent.com', //Google client Id'
                cookiepolicy: "single_host_origin",
                requestvisibleactions: "http://schema.org/AddAction",
                scope: "https://www.googleapis.com/auth/plus.login email"
            });
        }
        
        googleSignInCallback = (e) => {
            console.log( e )
            if (e["status"]["signed_in"]) {
                window.gapi.client.load("plus", "v1", function() {
                    if (e["access_token"]) {
                        this.getUserGoogleProfile( e["access_token"] )
                    } else if (e["error"]) {
                        console.log('Import error', 'Error occured while importing data')
                    }
                }.bind(this));
            } else {
                console.log('Oops... Error occured while importing data')
            }
        }
    
        getUserGoogleProfile = accesstoken => {
            let data = {type : 'google',data:{} };
            let _this = this;


            var e = window.gapi.client.plus.people.get({
                userId: "me"
            });
            e.execute(function(e) {
                if (e.error) {
                    console.log(e.message);
                    console.log('Import error - Error occured while importing data')
                    return
                
                } else if (e.id) {
                    //Profile data
                    alert("Successfull login from google : "+ e.displayName )
                    console.log( e );
                    data.data = {name:e.displayName,id:e.id};
                    _this.onSocialLogin(data);
                    return;                
                }
               
            }.bind(this));
        }
    onSocialLogin(data){
        const {dispatch} = this.props;
        dispatch(login(data));
    }

    onSignup(){
        const {dispatch} = this.props
        const {inputs, loading} = this.state
        const thisState = this;
        
        if( inputs.phone === "" ){
            this.setState({error: "Phone Number is Required"})
            return false;
        }

        this.setState( { error: ""}, ( () =>{
            if( this.state.error !== "" ){
                return false;
            }            
            window.AccountKit.login(
              'PHONE', 
              {countryCode: '+91', phone_number: inputs.phone }, // will use default values if not specified
              function( response ){
                    if (response.status === "PARTIALLY_AUTHENTICATED") {
                    var code = response.code;
                    inputs.code = code;
                    dispatch( login( inputs ) );
                }
                else if (response.status === "NOT_AUTHENTICATED") {
                    thisState.setState({ error : "Unable to generate OTP to verify your phone number" });
                }
                else if (response.status === "BAD_PARAMS") {
                    thisState.setState({ error : "Unable to generate OTP to verify your phone number" });
                }
              }
            );
        }) );
    }  

    render() {
        const {error} = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 bg">
                        <div className="wrap">
                            <p className="form-title">Sign In</p>
                            <div className="login">
                                <input type="text" placeholder="Enter Phone Number" />
                                <input type="submit" value="Sign In" className="btn btn-success btn-sm" />
                                <label className="text-center">or Connect With</label>
                                <input type="submit" value="Facebook" onClick={()=> this.facebookLogin()} style={{"background" : "#3b5998"}} className="btn btn-success btn-sm" />
                                <input type="submit" value="Google+"  onClick={ () => this.googleLogin() } style={{"background" : "#dd4b39"}} className="btn btn-success btn-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // <div className="container-fluid">
            //     <div className="container bg">
            //         <div className="container-middle">
            //             <div className="login-box">
            //             </div>
            //             {/* <h1>LOGIN</h1>
            //             <input placeholder="Enter your Phoneno"  onChange={ (e) => this.onInputChange(e, 'phone')} />
            //             <button  onClick={ () => this.onSignup() }>SIGN IN</button>
            //             <label>Or connect with</label>
            //             <button className="facebook-button">Facebook</button>
            //             <button className="google-button" >GOOGLE+</button> */}

            //         </div>
            //     </div>
            // </div>
        );
    }
}



const mapStateToProps = function( state ){
    return { signin : state.login.signin};
}

export default connect(mapStateToProps)(Login)

