//Relevant imports
import React from "react";
import { Route, Switch } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import Coursework from "./user/Coursework";
import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";
import Menu from "./core/Menu";
import Dashboard from "./admin/Dashboard";

//This section routes the urls to the correct React components and ensures they are
//only available to the correct user level
const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <PrivateRoute exact path="/" component={Coursework} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <AdminRoute path="/dashboard" component={Dashboard} />
        <Route path="/user/:userId" component={Profile} />
      </Switch>
    </div>
  );
};
export default MainRouter;
