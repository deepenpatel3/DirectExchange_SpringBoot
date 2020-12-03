import { message } from "antd";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getloggedInUser, numOfBankAccounts } from "../helpers/authHelper";

export const AllowedRoutes = ({ component: RouteComponent, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                let user = getloggedInUser();
                let numberOfBankAccounts = numOfBankAccounts();
                // console.log("user ", user, " num ", numberOfBankAccounts);
                if (user && numberOfBankAccounts > 1) {
                    return <RouteComponent {...props} />;
                } else {
                    message.error("Register at least 2 bank accounts")
                    return (
                        <Redirect
                            to={{
                                pathname: "/accounts",
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