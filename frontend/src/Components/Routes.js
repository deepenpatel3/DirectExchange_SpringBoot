import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
class Main extends Component {
    render() {
        return (
            <div>
                <Route path="/home" component={Dashboard} />
                <Route path="/" component={Login} />
            </div>
        )
    }
}

export default Main;