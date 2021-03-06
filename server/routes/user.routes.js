//Relevant Imports
import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

//These are the routes for the user api and which functions are to be called with each one
const router = express.Router();
router.route("/api/users").get(userCtrl.list).post(userCtrl.create);
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);
router
  .route("/api/users/admin/:userId")
  .get(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, userCtrl.list);
router.param("userId", userCtrl.userByID);
export default router;
