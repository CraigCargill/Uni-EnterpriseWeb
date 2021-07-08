//Relevant imports
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Person from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";
import DeleteUser from "./DeleteUser";
import auth from "./../auth/auth-helper";
import { read } from "./api-user.js";
import { Redirect, Link } from "react-router-dom";
import { returnMovieTitle } from "/client/utils.js";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import DeleteIcon from "@material-ui/icons/Delete";

//Material UI styles
const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  card: {
    width: 200,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    position: "relative",
  },
  CardContent: {
    padding: 0,
  },
  grid: {
    maxWidth: "100%",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  media: {
    height: 300,
  },
  favButton: {
    float: "right",
    bottom: "0px",
    paddingTop: "0px",
  },
  movieTitle: {
    height: "40px",
    overflow: "hidden",
    cursor: "pointer",
    padding: "16px 16px 0px 16px",
  },
}));

//The main component section for Profile
export default function Profile({ match }) {
  //Relevant variables created
  const classes = useStyles();
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
    about: "",
    favourites: [],
    open: false,
    error: "",
    redirectToProfile: false,
    isPosterStyle: true,
  });
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  //The React useEffect hook
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    //Reads the user data and sets the relevant variables to the data
    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        let favs = data.favourites;
        setUser(data);
        setFavouriteMovies([...favs]);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  //Updates the relevant parameters passed into it using the PUT command
  const update = async (params, credentials, user) => {
    try {
      let response = await fetch("/api/users/" + params.userId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  //This function takes a movieID and filters it out of the users favourites, then updating
  //the users favourites
  const removeFavourite = (movieID) => {
    let favouritesRemovedMovie = user.favourites.filter(
      (e) => e !== `${movieID}`
    );
    setUser({
      ...user,
      favourites: (user.favourites = favouritesRemovedMovie),
    });

    const value = {
      favourites: user.favourites || undefined,
    };
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      value
    ).then((data) => {
      if (data && data.error) {
        setUser({ ...user, error: data.error });
      } else {
        setUser({ ...user, userId: data._id });
      }
    });
  };

  //Redirecting if necessary
  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  //This is the main component rendered from Profile, this contains the users info displayed to the user
  //This also shows the users favourites to them
  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.email} />{" "}
            {auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id == user._id && (
                <ListItemSecondaryAction>
                  <Link to={"/user/edit/" + user._id}>
                    <IconButton aria-label="Edit" color="primary">
                      <Edit />
                    </IconButton>
                  </Link>
                  <DeleteUser userId={user._id} />
                </ListItemSecondaryAction>
              )}
          </ListItem>
          <ListItem>
            <ListItemText primary={user.about} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={"Joined: " + new Date(user.created).toDateString()}
            />
            {user.admin === true && <ListItemText primary={"Admin User"} />}
          </ListItem>
        </List>
      </Paper>
      {user.favourites.length > 0 && (
        <div>
          <Card className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.header}>
              Favourites
            </Typography>

            <Grid item xs={12}>
              <div>
                <List>
                  {user.favourites.map((item, index) => {
                    return (
                      <ListItem key={`${index}` + "a"}>
                        <ListItemText primary={returnMovieTitle(item)} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              removeFavourite(`${item}`);
                            }}
                          >
                            <DeleteIcon id={item} color="secondary" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </Grid>
          </Card>
        </div>
      )}
    </div>
  );
}
