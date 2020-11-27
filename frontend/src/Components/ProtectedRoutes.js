import React from "react";
import { Route, Redirect } from "react-router-dom";
import {getloggedInUser} from "../helpers/authHelper";

export const ProtectedRoute = ({ component: RouteComponent, ...rest}) => {
    return(
        <Route
            {...rest}
            render = {props => {
                if(getloggedInUser()){
                    return <RouteComponent {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {
                                    from: props.location
                                },
                                from: props.location.pathname
                            }}
                        />
                    );
                }
            }}
        />
    );
};