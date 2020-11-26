import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import BrowseOffer from "./Offer/BrowseOffer";
import MyOffers from './Offer/MyOffers';

class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/browseOffer" component={BrowseOffer} />
                <Route exact path="/myOffers" component={MyOffers} />
            </div>
        )
    }
}

export default Main;