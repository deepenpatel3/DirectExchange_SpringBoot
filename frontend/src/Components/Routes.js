import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
<<<<<<< HEAD
import Login from './Login';
=======
import BrowseOffer from "./Offer/BrowseOffer";
import MyOffers from './Offer/MyOffers';

>>>>>>> 0160144db938cc4e2a29cb3274d0d51e5080a32f
class Main extends Component {
    render() {
        return (
            <div>
<<<<<<< HEAD
                <Route path="/home" component={Dashboard} />
                <Route path="/" component={Login} />
=======
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/browseOffer" component={BrowseOffer} />
                <Route exact path="/myOffers" component={MyOffers} />
>>>>>>> 0160144db938cc4e2a29cb3274d0d51e5080a32f
            </div>
        )
    }
}

export default Main;