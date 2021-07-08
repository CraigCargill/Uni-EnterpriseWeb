//Imports for the file
import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth-helper";

//This sets up an 'AdminRoute' which checks to see if trhe user is
//an admin, if they are, direct them to the requested page, if not,
//redirect to the home directory
const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated().user !== undefined &&
      auth.isAuthenticated().user.admin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default AdminRoute;
