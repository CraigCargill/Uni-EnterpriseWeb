//Relevant imports
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../../config/config";

//This file contains the controller which can check authorisation levels and return if the
//user has or doesnt have the correct level

//This file also contaisn the login section which checks the users password and email against the database
const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return res.status("401").json({
        error: "User not found",
      });
    if (!user.authenticate(req.body.password)) {
      return res.status("401").send({
        error: "Email and password don't match.",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    );
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    });
  } catch (err) {
    return res.status("401").json({
      error: "Could not sign in",
    });
  }
};

//This section signs the user out and clears cookies
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out",
  });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//This section returns if the user has authorisation (in the case of this website, this means they are logged in)
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

//This section checks if the suer has admin privilages
const hasAdminAuthorization = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    req.profile._id == req.auth._id &&
    req.profile.admin == true;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized for admin",
    });
  }
  next();
};

//exporing these functions for global use
export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  hasAdminAuthorization,
};
