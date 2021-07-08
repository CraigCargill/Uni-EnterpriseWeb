//This file contains the API for the user part of the project, allowing retrieval and manipulation of data

//This function completes a post request that creates a new user from the inputted data
const create = async (user) => {
  try {
    let response = await fetch("/api/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function lists the users that are in the database with some limited details
const list = async (signal) => {
  try {
    let response = await fetch("/api/users/", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function lists the users in the database from an admin perspective, showing
//some more details
const listadmin = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/admin/" + params.userId, {
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

//This function asynchronously reads the data using a GET call, this then returns this
//in the form of JSON
const read = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
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

//This function updates a specific parameter that is passed into it, using a PUT call
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

//This function removes an item passed into it from the database using the DELETE call.
const remove = async (params, credentials) => {
  try {
    let response = await fetch("/api/users/" + params.userId, {
      method: "DELETE",
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

//Exporting these functions to the rest of the project
export { create, list, listadmin, read, update, remove };
