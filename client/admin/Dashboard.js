//Required imports

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import auth from "../auth/auth-helper";
import { read } from "./../user/api-dashboard";
import Chart from "react-google-charts";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { listadmin } from "../user/api-user.js";
import Button from "@material-ui/core/Button";
import {resetMetrics} from "./../user/api-dashboard";


//styles for the react components using material UI
const useStyles = makeStyles((theme) => ({
  lightMode: {
    backgroundColor: theme.palette.modes.lightMode,
  },
  darkMode: {
    backgroundColor: theme.palette.modes.darkMode,
  },
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
  resetButton: {
    width: "100%",
    backgroundColor: "red",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  header: {
    fontSize: theme.typography.pxToRem(20),
    flexBasis: "33.33%",
    flexShrink: 0,
    textAlign: "center",
    marginTop: "10px",
  },
  header2: {
    fontSize: theme.typography.pxToRem(17),
    flexBasis: "33.33%",
    flexShrink: 0,
    textAlign: "center",
  },
  number: {
    fontSize: theme.typography.pxToRem(30),
    flexBasis: "33.33%",
    flexShrink: 0,
    textAlign: "center",
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


//Dashboard component
export default function Dashboard() {
  //setting up necessary variables using useState
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const jwt = auth.isAuthenticated();
  const [dashboardMetrics, setDashboardMetrics] = useState([]);


  //This function returns an array with the stats that are shown on the dashboard,
  //it takes in a list of the user data
  function returnDashboardStats(allUsersData) {
    let posterData = {};
    let backgroundData = {};
    if(dashboardMetrics[0].style === "poster"){
      posterData = dashboardMetrics[0];
      backgroundData = dashboardMetrics[1];
    }else if(dashboardMetrics[0].style === "background"){
      backgroundData = dashboardMetrics[0];
      posterData = dashboardMetrics[1];
    }

    let userData = allUsersData.users
    let stats = [];
    let numInPoster = posterData.count;
    let numInBackground = backgroundData.count;

    let avgFavourites = 0;
    let avgSwitched = 0;

    userData.forEach(function(user) {
      avgFavourites = avgFavourites + user.favourites.length;
    })

    avgSwitched = posterData.switchedTo + backgroundData.switchedTo
    avgFavourites = avgFavourites / userData.length;
    

    stats.push(numInPoster, numInBackground, avgFavourites.toFixed(1), avgSwitched);
    avgSwitched = avgSwitched / userData.length;
    stats.push(avgSwitched.toFixed(1), posterData.usedHomeIcon, posterData.usedHomeText);

    return stats;
  }


  //This function shows a pie chart using google react charts, the pie chart
  //shows the data from poster vs background choices.
  function showPieChart(numInPoster, numInBackground) {
    return (
        <Chart
          width={"100%"}
          height={"auto"}
          al
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Style', 'Choice'],
            ['Poster', numInPoster],
            ['Background', numInBackground],
          ]}
          options={{
            title: "Poster vs Background",
          }}
          rootProps={{ "data-testid": "1" }}
        />
    );
  }

  //This function shows a pie chart using google react charts, the pie chart
  //shows the data from home icon vs home text options
  function showPieChartHome(numIcon, numText) {
    if(numIcon > 0 || numText > 0){
      return (
        <Chart
          width={"100%"}
          height={"auto"}
          al
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Home Choice', 'Choice'],
            ['Icon', numIcon],
            ['Text', numText],
          ]}
          options={{
            title: "Home Icon vs Text",
          }}
          rootProps={{ "data-testid": "1" }}
        />
    );
    }else{
      return (
        <Typography className={classes.header}>
                Data will appear here when users select the home or icon options
        </Typography>
      )
    }
    
  } 


  //This is the UseEffect hook from react
  useEffect(() => {
    //setting up abortcontroller and signal for if user navigates away
    const abortController = new AbortController();
    const signal = abortController.signal;

    //Calls the read function to get the user data, sending the jwt token as auth
    read({t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setDashboardMetrics(data);
      }
    });

    //calling the listadmin function, this will return a list of all users in the database
    listadmin({ userId: jwt.user._id }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);


  //This is an asynchronous function that resets the metrics on the dashboard that can be reset
  //The function calls the reset metrics function in the api-dashboard and then updates the 
  //dashboard metrics
  async function resetSwitchMetrics(){
    const abortController = new AbortController();
    const signal = abortController.signal;
    

    resetMetrics({ t: jwt.token }).then(() => {
      read({t: jwt.token}, signal).then((data) => {
        if (data && data.error) {
          console.log(data.error);
        } else {
          setDashboardMetrics(data);
        }
      });
    });
  }


  //This is the main return for the dashboard component using material UI This area
  //uses a grid to organise all the components in a sensible and adaptable way
  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h6" className={classes.title}>
          Dashboard
        </Typography>
        <Typography className={classes.header}>
                Users
        </Typography>
        {users.length > 0 && (
          <div>
          <Grid item xs={12}>
          <Paper elevation={2}>
            <List>
              {users.map((item, index) => {
                return (
                  <ListItem key={`${index}` + "a"}>
                    <ListItemText primary={item.name} />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
          </Grid>
            <Typography className={classes.header}>
                Users In Each Style
            </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Poster style
                </Typography>
                <Typography className={classes.number}>
                  {dashboardMetrics.length > 0 && (
                      returnDashboardStats({users})[0]
                  )}
                </Typography >
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Background style
                </Typography>
                <Typography className={classes.number}>
                {dashboardMetrics.length > 0 && (
                      returnDashboardStats({users})[1]
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Total Style Switches
                </Typography>

                {dashboardMetrics.length > 0 && (
                  <div>
                    <Typography className={classes.number}>
                      {returnDashboardStats({users})[3]}
                    </Typography >
                   </div>
                )}
                
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Avg Style Switches
                </Typography>
                <Typography className={classes.number}>
                {dashboardMetrics.length > 0 && (
                      returnDashboardStats({users})[4]
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Average number of Favourites
                </Typography>
                <Typography className={classes.number}>
                {dashboardMetrics.length > 0 && (
                      returnDashboardStats({users})[2]
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography className={classes.header}>
                Home Icon vs Text
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Icon
                </Typography>
                <Typography className={classes.number}>
                  {dashboardMetrics.length > 0 && (
                      returnDashboardStats({users})[5]
                  )}
                </Typography >
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={2}>
                <Typography className={classes.header2}>
                Text
                </Typography>
                <Typography className={classes.number}>
                {dashboardMetrics.length > 0 && (
                      returnDashboardStats({users})[6]
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              {showPieChart(returnDashboardStats({users})[0], returnDashboardStats({users})[1])}
            </Grid>
            <Grid item xs={12}>
              {showPieChartHome(returnDashboardStats({users})[5], returnDashboardStats({users})[6])}
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                autoFocus="autoFocus"
                variant="contained"
                className={classes.resetButton}
                onClick={() => {
                  resetSwitchMetrics();
                }}
              >
                Reset Metrics
              </Button>
            </Grid>
          </Grid>
            <div>
          </div>
        
        </div>
        
        )}
      </Paper>
    </div>
  );
}
