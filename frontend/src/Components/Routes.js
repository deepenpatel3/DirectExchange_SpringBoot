import React, { Component } from 'react';
import { Route  , Switch , Redirect} from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import VerifyEmail from './VerifyEmail';
import { ProtectedRoute} from './ProtectedRoutes'
class Main extends Component {
    render() {
        return (
            <div>
               <Route exact path="/">
                    <Redirect to="/login" />
                </Route>
                <Route exact path="/login" component={Login} />
                <Route   exact path="/verify/:id" component={VerifyEmail} />
                {/* protected routes */}
                <ProtectedRoute path="/home" component={Dashboard} />
            </div>
        )
    }
}

export default Main;