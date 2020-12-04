
import React, { Component } from 'react';
// import Navbar from './Reuse/Navbar';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Layout, Card, message } from 'antd';
import axios from "axios";
import { login } from '../helpers/authHelper'
// import { process } from 'uniqid';
require('dotenv').config();
// const process = require('process');

var uniqid = require('uniqid');
const { Header, Content, Footer } = Layout;


class Login extends Component {

    // The component's Local state.
    state = {
        isSignedIn: false,// Local signed-in state.
        emailVerified: false
    };

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        //signInSuccessUrl: '/home',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            // signInSuccessWithAuthResult: async (_authResult, _redirectUrl) => {
            //     await this.navigateRedirect();
            // }
            signInSuccessWithAuthResult: async (_authResult, _redirectUrl) => {
                if (_authResult.additionalUserInfo.isNewUser) {
                    await this.createNewUser();
                }
            }
        }
    };

    userVerified = async () => {

        console.log(`userverified called, ${process.env.REACT_APP_BACKEND_URL}`);
        try {
            // let uid = firebase.auth().currentUser.uid;
            console.log("uid ", firebase.auth().currentUser.uid);
            let user = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/uid/${firebase.auth().currentUser.uid}`);

            if (user.data.verified) {
                user.data.displayName = firebase.auth().currentUser.displayName ;
                login(user.data);
                window.location.href = 'home'
            }
        }
        catch (e) {
            console.log(e.message);
        }
    }
    createNewUser = async () => {
        console.log("create new user called");
        let currentUser = firebase.auth().currentUser;
        let data = {
            uid: currentUser.uid,
            username: currentUser.email,
            nickname: uniqid('direct-exchange-')
        }
        console.log("data ", data);
        try {
            console.log("calling create user api");
            let newUser = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user`, data);
            console.log("newUser ", newUser);
            await this.sendVerificationMail(newUser.data.id);
        }
        catch (e) {
            message.error(e.message);
        }
        return false;
    }

    sendVerificationMail = async (id) => {
        console.log("send verification mail called");
        var actionCodeSettings = {
            url: 'http://localhost:3000/verify/' + id,
        };
        await firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
            .then(function () {
                // Verification email sent.
            });
    }
    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {

        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(

            async (user) => {
                console.log(user);
                if (user) {
                    await this.userVerified();
                }
                this.setState({ isSignedIn: !!user })
            }
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }
    render() {
        if (!this.state.isSignedIn) {
            return (
                <Card title="Login/Signup" style={{ width: 400, margin: "auto", marginTop: "100px", verticalAlign: "middle" }}>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={
                        firebase.auth()
                    } />
                </Card>
            );
        }
        else {

            if (!this.state.emailVerified)
                return (
                    <Card title="Verify your email" style={{ width: 400, margin: "auto", marginTop: "100px", verticalAlign: "middle" }}>
                        An email has been sent to { firebase.auth().currentUser.email}.
                    </Card>
                );
        }

        // return (
        //     <div>
        //         <h1>My App</h1>
        //         <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
        //         <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
        //     </div>
        // );

    }
}

export default Login;