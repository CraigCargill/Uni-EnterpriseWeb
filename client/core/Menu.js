//Relevant imports
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";
import {
  increaseHomeIconPoster,
  increaseHomeTextPoster,
} from "../user/api-dashboard";

//This function checks if the page is active and if so sets the relevant styles for the object
const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#E50914" };
  else return { color: "#ffffff" };
};

//This function returns if the user has admin privilages or not
function isAdmin() {
  const authenticated = auth.isAuthenticated();
  if (authenticated && authenticated.user) {
    return authenticated.user.admin;
  } else {
    return false;
  }
}

//This is the main section for the menu
const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      {/* If the user is authenticated, show the menu bar section for FavFlicks, also if the user clicks
      on this segment, the approriate database entry will be udpated to track this */}
      {auth.isAuthenticated() && (
        <span color="#ffffff">
          <Link
            to={"/"}
            onClick={() => {
              increaseHomeTextPoster({
                t: JSON.parse(sessionStorage.getItem("jwt")),
              });
            }}
          >
            <Button style={isActive(history, "/home")}>FavFlicks</Button>
          </Link>
        </span>
      )}
      {/* If the user is not authenticated, show the text but do not add to database */}
      {!auth.isAuthenticated() && (
        <span color="#ffffff">
          <Link to={"/signin"}>
            <Typography variant="h6">FavFlicks</Typography>
          </Link>
        </span>
      )}
      {/* If the user is authenticated, show the home button, similarly to the text, if clicked add to icon tracking */}
      {auth.isAuthenticated() && (
        <span>
          <Link
            to={"/"}
            onClick={() => {
              increaseHomeIconPoster({
                t: JSON.parse(sessionStorage.getItem("jwt")),
              });
            }}
          >
            <IconButton aria-label="Home" style={isActive(history, "/")}>
              <HomeIcon />
            </IconButton>
          </Link>
        </span>
      )}
      {/* If the user is not logged in, show the signup and signin buttons */}
      {!auth.isAuthenticated() && (
        <span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up</Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In</Button>
          </Link>
        </span>
      )}
      {/* If the user is logged in, show the my profile options */}
      {auth.isAuthenticated() && (
        <span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button
              style={isActive(
                history,
                "/user/" + auth.isAuthenticated().user._id
              )}
            >
              My Profile
            </Button>
          </Link>
        </span>
      )}
      {/* If the user is logged in and has admin privilages, show the dashboard page */}
      {isAdmin() && (
        <span>
          <Link to={"/dashboard"}>
            <Button style={isActive(history, "/dashboard")}>Dashboard</Button>
          </Link>
        </span>
      )}
      {/* If the user is logged in, show the sign out page */}
      {auth.isAuthenticated() && (
        <span>
          <Button
            color="inherit"
            onClick={() => {
              auth.clearJWT(() => history.push("/signin"));
            }}
          >
            Sign out
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
));

export default Menu;
