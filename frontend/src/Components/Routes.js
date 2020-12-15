
import React, { Component } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import VerifyEmail from './VerifyEmail';
import { ProtectedRoute } from './ProtectedRoutes';
import { AllowedRoutes } from "./AllowedRoutes";
import BrowseOffer from "./Offer/BrowseOffer";
import MyOffers from "./Offer/MyOffers";
import BankAccounts from './BankAccounts';
import Offers from "./Offer/Offer";
import MyOffersNew from "./Offer/MyOffersNew";
import TransactionHistory from "./TransactionHistory";
import SystemReport from "./FinancialReport";
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
                <AllowedRoutes path="/browseOffer" component={BrowseOffer} />
                <ProtectedRoute path="/myOffers" component={MyOffersNew} />
                <ProtectedRoute path="/accounts" component={BankAccounts} />
                <ProtectedRoute path="/offer" component={Offers} />
                <AllowedRoutes path="/transactionHistory" component={TransactionHistory} />
                <AllowedRoutes path="/systemReport" component={SystemReport} />
            </div>
        )
    }
}

export default Main;

