//This function is asyncronously posting the user to the mongoDB database,
//the user data is passed in
const signin = async (user) => {
  try {
    let response = await fetch("/auth/signin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//This function is asyncronously signing out the user using the signout GET method from the api
const signout = async () => {
  try {
    let response = await fetch("/auth/signout/", { method: "GET" });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export { signin, signout };
