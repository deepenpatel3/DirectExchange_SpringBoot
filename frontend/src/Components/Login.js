import React, { Component } from 'react';
// import Navbar from './Reuse/Navbar';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// Configure Firebase.
const config = {
    apiKey: "AIzaSyD7nLgAxbHd6pimha4gvFkIwsqt-Fqck50",
    authDomain: "directexchange-47010.firebaseapp.com",
    databaseURL: "https://directexchange-47010.firebaseio.com",
    projectId: "directexchange-47010",
    storageBucket: "directexchange-47010.appspot.com",
    messagingSenderId: "484190305866",
    appId: "1:484190305866:web:e021a1dbb7e3838ea0b0b3"
};
firebase.initializeApp(config);



class Login extends Component {

    // The component's Local state.
    state = {
        isSignedIn: false // Local signed-in state.
    };

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/home',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            
            
            (user) => {
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
                <div>
                    <h1>DirectExchange</h1>
                    <p>Please sign-in:</p>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={
                        firebase.auth()
                    } />
                </div>
            );
        }
        return (
            <div>
                <h1>My App</h1>
                <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
                <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
            </div>
        );

    }
}

export default Login;