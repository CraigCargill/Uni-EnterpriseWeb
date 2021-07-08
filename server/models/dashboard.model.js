//Relevant Imports
import mongoose from "mongoose";

//This section outlines a schema for the dashboard, the required fields and their properties
const DashboardSchema = new mongoose.Schema({
  style: {
    type: String,
    default: "",
  },
  count: {
    type: Number,
    default: 0,
  },
  switchedTo: {
    type: Number,
    default: 0,
  },
  usedHomeIcon: {
    type: Number,
    default: 0,
  },
  usedHomeText: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Dashboard", DashboardSchema);
