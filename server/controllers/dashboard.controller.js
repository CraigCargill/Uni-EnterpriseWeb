//Relevant Imports
import Dashboard from "../models/dashboard.model";
import extend from "lodash/extend";
import errorHandler from "../helpers/dbErrorHandler";

//This function creates a new dashboard entry if required (may be used in future to make more styles)
const create = async (req, res) => {
  const dash = new Dashboard(req.body);
  try {
    await dash.save();
    return res.status(200).json({
      message: "Successfully added dash!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This function asynchronously returns the requested dash file from its ID
const dashByID = async (req, res, next, uId, dId) => {
  try {
    let dash = await Dashboard.findById(dId);
    if (!dash)
      return res.status("400").json({
        error: "Dash not found",
      });
    req.profile = dash;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve dash",
    });
  }
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

//This section returns each entry in the dashboard collection with the properties listed below
const list = async (req, res) => {
  try {
    let dashboards = await Dashboard.find().select(
      "style count switchedTo usedHomeIcon usedHomeText"
    );
    res.json(dashboards);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section updates the passed into parameters of the dash
const update = async (req, res) => {
  try {
    let dash = req.profile;
    dash = extend(dash, req.body);
    dash.updated = Date.now();
    await dash.save();
    res.json(dash);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section resets the appropriate metrics stores in the dash, only metrics not involving
//Current user choice (i.e. their currect style) will be reset, users will not see any affect of this
const resetMetrics = async (req, res) => {
  try {
    var PosterMetric = await Dashboard.findOne({ style: "poster" });
    let newPosterMetric = PosterMetric;
    newPosterMetric.switchedTo = 0;
    newPosterMetric.usedHomeIcon = 0;
    newPosterMetric.usedHomeText = 0;
    PosterMetric = extend(PosterMetric, newPosterMetric);

    var BackgroundMetric = await Dashboard.findOne({ style: "background" });
    let newBackgroundMetric = BackgroundMetric;
    newBackgroundMetric.switchedTo = 0;
    BackgroundMetric = extend(BackgroundMetric, newBackgroundMetric);

    await PosterMetric.save();
    await BackgroundMetric.save();
    return res.status(200).json({
      message: "Successfully reset metrics",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section increases the poster choice by one and adds to the choice metric as long
//as the user did not just create their account
const increasePoster = async (req, res) => {
  try {
    var PosterMetric = await Dashboard.findOne({ style: "poster" });
    let newPosterMetric = { ...PosterMetric, count: PosterMetric.count + 1 };
    if (req.body.user === false) {
      newPosterMetric.switchedTo = PosterMetric.switchedTo + 1;
    }
    PosterMetric = extend(PosterMetric, newPosterMetric);
    await PosterMetric.save();
    return res.status(200).json({
      message: "Successfully increased poster",
    });
  } catch (err) {
    console.log("error: " + err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section increases the Background choice by one and adds to the choice metric
const increaseBackground = async (req, res) => {
  try {
    var BackgroundMetric = await Dashboard.findOne({ style: "background" });
    var newSwitchedTo = BackgroundMetric.switchedTo + 1;
    let newBackgroundMetric = {
      ...BackgroundMetric,
      count: BackgroundMetric.count + 1,
      switchedTo: newSwitchedTo,
    };
    BackgroundMetric = extend(BackgroundMetric, newBackgroundMetric);
    await BackgroundMetric.save();
    return res.status(200).json({
      message: "Successfully increased background",
    });
  } catch (err) {
    console.log("error: " + err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section decreasees the poster choice by one as the user has left this style
const decreasePoster = async (req, res) => {
  try {
    var PosterMetric = await Dashboard.findOne({ style: "poster" });

    let newPosterMetric = {
      ...PosterMetric,
      count: PosterMetric.count - 1,
    };

    PosterMetric = extend(PosterMetric, newPosterMetric);

    await PosterMetric.save();
    return res.status(200).json({
      message: "Successfully decreased poster",
    });
  } catch (err) {
    console.log("error: " + err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section decreasees the background choice by one as the user has left this style
const decreaseBackground = async (req, res) => {
  try {
    var BackgroundMetric = await Dashboard.findOne({ style: "background" });
    let newBackgroundMetric = {
      ...BackgroundMetric,
      count: BackgroundMetric.count - 1,
    };

    BackgroundMetric = extend(BackgroundMetric, newBackgroundMetric);

    await BackgroundMetric.save();
    return res.status(200).json({
      message: "Successfully decreased background",
    });
  } catch (err) {
    console.log("error: " + err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section can remove dashes if required
const remove = async (req, res) => {
  try {
    let udashser = req.profile;
    let deletedDash = await dash.remove();
    res.json(deletedDash);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section increases the homeIcon choice metric, the relevant data is stored in the Poster field
const increaseHomeIconPoster = async (req, res) => {
  try {
    var PosterMetric = await Dashboard.findOne({ style: "poster" });
    var newIcon = PosterMetric.usedHomeIcon + 1;
    let newPosterMetric = {
      ...PosterMetric,
      usedHomeIcon: newIcon,
    };
    PosterMetric = extend(PosterMetric, newPosterMetric);
    await PosterMetric.save();
    return res.status(200).json({
      message: "Successfully increased poster Icon",
    });
  } catch (err) {
    console.log("error: " + err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//This section increases the homeText choice metric
const increaseHomeTextPoster = async (req, res) => {
  try {
    var PosterMetric = await Dashboard.findOne({ style: "poster" });
    var newText = PosterMetric.usedHomeText + 1;
    let newPosterMetric = {
      ...PosterMetric,
      usedHomeText: newText,
    };
    PosterMetric = extend(PosterMetric, newPosterMetric);
    await PosterMetric.save();
    return res.status(200).json({
      message: "Successfully increased poster Text",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//Exporting relevant functions globally
export default {
  create,
  dashByID,
  read,
  list,
  remove,
  update,
  increasePoster,
  increaseBackground,
  decreasePoster,
  decreaseBackground,
  resetMetrics,
  increaseHomeTextPoster,
  increaseHomeIconPoster,
};
