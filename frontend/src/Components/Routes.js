import React, { Component } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import VerifyEmail from './VerifyEmail';
import { ProtectedRoute } from './ProtectedRoutes'
import BrowseOffer from "./Offer/BrowseOffer";
import MyOffers from "./Offer/MyOffers";
import Offers from "./Offer/Offer";


class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/">
                    <Redirect to="/login" />
                </Route>
                <Route exact path="/login" component={Login} />
                <Route exact path="/verify/:id" component={VerifyEmail} />
                {/* protected routes */}
                <ProtectedRoute path="/home" component={Dashboard} />
                <ProtectedRoute path="/browseOffer" component={BrowseOffer} />
                <ProtectedRoute path="/myOffers" component={MyOffers} />
                <ProtectedRoute path="/offer" component={Offers} />
            </div>
        )
    }
}

export default Main;
