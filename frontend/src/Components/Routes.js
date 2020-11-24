import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';

class Main extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={Dashboard} />
            </div>
        )
    }
}

export default Main;