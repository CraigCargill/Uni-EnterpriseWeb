//Relevant Imports
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import auth from "../auth/auth-helper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import { movieBackground, returnJSON, moviePoster } from "/client/utils.js";
import { returnTenMovies } from "../utils";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import { read } from "./api-user.js";
import { Redirect } from "react-router-dom";
import Zoom from "@material-ui/core/Zoom";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { PlayCircleFilledWhite } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import { CardActions } from "@material-ui/core";
import {
  increasePoster,
  decreasePoster,
  increaseBackground,
  decreaseBackground,
} from "./api-dashboard";

//This section is the material UI styling of the components in this file
const useStyles = makeStyles((theme) => ({
  card: {
    width: 200,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    position: "relative",
  },
  searchContainer: {
    width: "80%",
    marginLeft: "10%",
  },
  searchResults: {
    width: "40%",
    marginLeft: "30%",
    marginBottom: "5px",
  },
  searchBar: {
    margin: theme.spacing(1),
    width: "80%",
    marginLeft: "10%",
  },
  body: {
    marginTop: theme.spacing(5),
  },
  CardContent: {
    padding: 0,
  },
  grid: {
    maxWidth: "100%",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  header: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px ${theme.spacing(0)}px`,
    color: theme.palette.openTitle,
    fontSize: "15px",
    textAlign: "center",
  },
  media: {
    height: 300,
  },
  credit: {
    padding: 10,
    textAlign: "right",
    backgroundColor: "#ededed",
    borderBottom: "1px solid #d0d0d0",
    "& a": {
      color: "#3f4771",
    },
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
  GridListTile: {
    width: 400,
    height: 200,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    listStyleType: "none",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  title: {
    color: PlayCircleFilledWhite,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  button: {
    align: "left",
  },
}));

//This is the main component of the coursework file
export default function Coursework() {
  //This section defines the variables required throught the component
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    about: "",
    favourites: [],
    open: false,
    error: "",
    redirectToProfile: false,
    isPosterStyle: "",
    isNewUser: false,
  });
  const jwt = auth.isAuthenticated();
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setsearchedMovies] = useState([]);
  const [checked, setChecked] = React.useState(false);

  //This function sets the movies variable to the JSON response of the third party API
  const getMovie = () => {
    setChecked(true);
    for (var x = 1; x < 6; x++) {
      returnJSON(x).then((data) => {
        let movies = returnTenMovies(data.results);
        allMovies.push(...movies);
        setMovies([...allMovies]);
      });
    }
  };

  //This section is the UseEffect hook from react
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    //Calling the getMovie function to get top movies
    getMovie();

    //Reading the user data
    read(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          favourites: data.favourites,
          isPosterStyle: data.isPosterStyle,
          isNewUser: data.isNewUser,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [jwt.user._id]);

  //setting allMovies variable as array
  var allMovies = [];

  //This function updates the passed in parameters using the PUT call
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

  //This function adds the movieID passed into it into the users favourite array
  const addFavourite = (movieID) => {
    let favouritesAddedMovie = values.favourites;
    favouritesAddedMovie.push(`${movieID}`);

    setValues({
      ...values,
      favourites: (values.favourites = favouritesAddedMovie),
    });
    const user = {
      favourites: values.favourites || undefined,
    };
    update(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id });
      }
    });
  };

  //This function removes the passed in movieID from the users favourite array
  const removeFavourite = (movieID) => {
    let favouritesRemovedMovie = values.favourites.filter(
      (e) => e !== `${movieID}`
    );
    setValues({
      ...values,
      favourites: (values.favourites = favouritesRemovedMovie),
    });

    const user = {
      favourites: values.favourites || undefined,
    };
    update(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id });
      }
    });
  };

  //This function takes in a new style, it will then update the users file with
  //the new style chocie
  const toggleStyle = (style) => {
    setValues({
      ...values,
      isPosterStyle: (values.isPosterStyle = style),
    });
    const user = {
      isPosterStyle: style || undefined,
    };
    update(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id });
      }
    });

    if (style === "poster") {
      increasePoster({ t: jwt.token });
      decreaseBackground({ t: jwt.token });
    } else {
      if (values.isNewUser === true) {
        increaseBackground({ t: jwt.token });

        setValues({
          ...values,
          isNewUser: (values.isNewUser = false),
        });
        const user = {
          isNewUser: false,
        };
        console.log(user);
        update(
          {
            userId: jwt.user._id,
          },
          {
            t: jwt.token,
          },
          user
        ).then((data) => {
          if (data && data.error) {
            setValues({ ...values, error: data.error });
          } else {
            setValues({ ...values, userId: data._id });
          }
        });
      } else {
        increaseBackground({ t: jwt.token });
        decreasePoster({ t: jwt.token });
      }
    }
  };

  //This function will call the approriate function based on whether or not the movie
  //is already favourited.
  function toggleFavourite(movieID) {
    if (!values.favourites.includes(movieID)) {
      addFavourite(movieID);
    } else {
      removeFavourite(movieID);
    }
  }

  //This function shows the favourite or delete icon based on whether the movie is already
  //favourited
  function showIcon(movieID) {
    if (!values.favourites.includes(movieID)) {
      return <FavoriteIcon id={movieID} color="secondary" />;
    } else {
      return <DeleteIcon id={movieID} color="secondary" />;
    }
  }

  //This is the layout of the poster style, this function takes in a movie and will create a
  //component based off of that input, this will then be returned
  function showPosterStyle(item, index) {
    return (
      <Zoom in={checked} key={`${index}` + "a"}>
        <Card className={classes.card} key={`${index}` + "aa"}>
          <CardMedia
            className={classes.media}
            image={moviePoster(item)}
            title="Page"
          />
          <Tooltip title={item.original_title}>
            <Typography
              variant="body2"
              component="p"
              className={classes.movieTitle}
            >
              {item.original_title}
            </Typography>
          </Tooltip>
          <IconButton
            aria-label="toggle favorites"
            className={classes.favButton}
            onClick={() => {
              toggleFavourite(`${item.id}` + "*" + `${item.original_title}`);
            }}
          >
            {showIcon(`${item.id}` + "*" + `${item.original_title}`)}
          </IconButton>
        </Card>
      </Zoom>
    );
  }

  //This is the layout of the background style, this function takes in a movie and will create a
  //component based off of that input, this will then be returned
  function showBackgroundStyle(item, index) {
    return (
      <Zoom in={checked} key={`${index}` + "a"}>
        <GridListTile className={classes.GridListTile} key={`${index}` + "a1"}>
          <img
            position="absolute"
            src={movieBackground(item)}
            alt={item.original_title}
          />
          <GridListTileBar
            title={item.original_title}
            classes={{
              root: classes.titleBar,
              title: classes.title,
            }}
            actionIcon={
              <IconButton
                aria-label="toggle favorites"
                className={classes.favButton}
                onClick={() => {
                  toggleFavourite(
                    `${item.id}` + "*" + `${item.original_title}`
                  );
                }}
              >
                {showIcon(`${item.id}` + "*" + `${item.original_title}`)}
              </IconButton>
            }
          />
        </GridListTile>
      </Zoom>
    );
  }

  //This fucntion asynchronously calls the tmdb api for any movies that match the query, then
  //returns the top 10 in an array
  async function searchMovies(query) {
    if (query.length > 3) {
      query = query.split(" ").join("%20");
      let result = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=5e8f835586165f79f50e14c3421697c9&language=en-US&query=${query}&page=1&include_adult=false`
      ).then((response) => response.json());
      let firstTen = result.results.slice(0, 10);
      setsearchedMovies(firstTen);
    } else {
      setsearchedMovies([]);
    }
  }

  //This section is the main component of teh Coursework file, the component uses many material UI
  //components but are based around a Grid which keeps everything in a sensible layout
  return (
    <div className={classes.body}>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="center"
        className={classes.searchContainer}
      >
        <Grid item xs={12}>
          <Card>
            <TextField
              id="standard-search"
              label="Search Movies"
              type="search"
              width="100%"
              varient="outlined"
              className={classes.searchBar}
              onChange={(event) => {
                searchMovies(event.target.value);
              }}
            />
          </Card>
        </Grid>
        <Grid item>
          <CardActions>
            {values.isLightMode === "light" && (
              <Button
                color="primary"
                autoFocus="autoFocus"
                variant="contained"
                onClick={() => {
                  toggleStyle("poster");
                }}
              >
                Light
              </Button>
            )}
            {values.isPosterStyle == "background" && (
              <Button
                color="primary"
                autoFocus="autoFocus"
                variant="contained"
                onClick={() => {
                  toggleStyle("poster");
                }}
              >
                Toggle to Poster style
              </Button>
            )}
            {values.isPosterStyle == "poster" && (
              <Button
                color="primary"
                autoFocus="autoFocus"
                variant="contained"
                onClick={() => {
                  toggleStyle("background");
                }}
              >
                Toggle to Background style
              </Button>
            )}
          </CardActions>
        </Grid>
      </Grid>

      {searchedMovies.length > 0 && (
        <div className={classes.searchResults}>
          <Card className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.header}>
              Search Results
            </Typography>

            <Grid item xs={12}>
              <div>
                <List>
                  {searchedMovies.map((item, index) => {
                    return (
                      <ListItem key={`${index}` + "a"}>
                        <ListItemText primary={item.original_title} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              toggleFavourite(
                                `${item.id}` + "*" + `${item.original_title}`
                              );
                            }}
                          >
                            {showIcon(
                              `${item.id}` + "*" + `${item.original_title}`
                            )}
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

      <Paper className={classes.root} elevation={4}>
        {movies.length > 0 && (
          <div>
            <Typography variant="h6" className={classes.header}>
              Top Movies
            </Typography>
            {values.isPosterStyle === "poster" && (
              <Grid
                container
                item
                xs={12}
                direction="row"
                justify="center"
                className={classes.Grid}
              >
                {movies.map((item, index) => {
                  return showPosterStyle(item, index);
                })}
              </Grid>
            )}
            {values.isPosterStyle === "background" && (
              <div className={classes.root}>
                <Grid
                  container
                  item
                  xs={12}
                  direction="row"
                  justify="center"
                  className={classes.Grid}
                >
                  {movies.map((item, index) => {
                    return showBackgroundStyle(item, index);
                  })}
                </Grid>
              </div>
            )}
          </div>
        )}
      </Paper>
    </div>
  );
}
