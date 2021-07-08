import { signout } from "./api-auth.js";

//This function has multiple authorisations inside of it
const auth = {
  //This section checks if the jwt passed in exists and if the window is not undefined (running headless)
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem("jwt"))
      return JSON.parse(sessionStorage.getItem("jwt"));
    else return false;
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  //This section clears the JWT from the session storage to ensure logout
  clearJWT(cb) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    cb();
    //optional
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
};
export default auth;
