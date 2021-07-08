//This file is the api for the dashboard data storage, it has functions to return and set dashboard metrics

//This function requests the data from the database in the dashes collection and returns to the user
const read = async (credentials, signal) => {
  try {
    let response = await fetch("/api/dashes/", {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This section pushes a reset on all the metrics that can be reset in the dashes collection
const resetMetrics = async (credentials) => {
  try {
    let response = await fetch("/api/dashes/reset", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function increases the number of users using the poster layout style, also adding to
//the switchedTo metric
const increasePoster = async (credentials, isNewUser = false) => {
  try {
    let response = await fetch("/api/dashes/poster/increase", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ user: isNewUser }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function decreased the users using the background style of layout
const decreaseBackground = async (credentials) => {
  try {
    let response = await fetch("/api/dashes/background/decrease", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function increases the users using the background style and adds to the switchedTo Metric
const increaseBackground = async (credentials) => {
  try {
    let response = await fetch("/api/dashes/background/increase", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function decreases the users using the poster style
const decreasePoster = async (credentials) => {
  try {
    let response = await fetch("/api/dashes/poster/decrease", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function increases the users every time they use the HomeIcon to go home
const increaseHomeIconPoster = async (credentials) => {
  try {
    let response = await fetch("/api/dashes/poster/homeIcon", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function increases the users every time they use the HomeText to go home
const increaseHomeTextPoster = async (credentials) => {
  try {
    let response = await fetch("/api/dashes/poster/homeText", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//Exporting these so the API can be called in the rest of the project
export {
  read,
  decreasePoster,
  decreaseBackground,
  increasePoster,
  increaseBackground,
  resetMetrics,
  increaseHomeIconPoster,
  increaseHomeTextPoster,
};
