//Relevant Imports
import express from "express";
import dashCtrl from "../controllers/dashboard.controller";
import authCtrl from "../controllers/auth.controller";

//These are the routes for the dash api and what can be done at what user level,
//also the appropriate functions to be called
const router = express.Router();
router.route("/api/dashes").get(dashCtrl.list).post(dashCtrl.create);
router.route("/api/dashes/poster/increase").put(dashCtrl.increasePoster);
router.route("/api/dashes/poster/decrease").put(dashCtrl.decreasePoster);
router.route("/api/dashes/reset").put(dashCtrl.resetMetrics);
router
  .route("/api/dashes/background/increase")
  .put(dashCtrl.increaseBackground);
router
  .route("/api/dashes/background/decrease")
  .put(dashCtrl.decreaseBackground);
router
  .route("/api/dashes/poster/homeIcon")
  .put(dashCtrl.increaseHomeIconPoster);
router
  .route("/api/dashes/poster/homeText")
  .put(dashCtrl.increaseHomeTextPoster);
router
  .route("/api/dashes/:dashID")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, dashCtrl.list);
router
  .route("/api/dashes/admin/:userID/:dashId")
  .get(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, dashCtrl.list)
  .put(authCtrl.requireSignin, authCtrl.hasAdminAuthorization, dashCtrl.update)
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAdminAuthorization,
    dashCtrl.remove
  );
router.param("dashId", dashCtrl.dashByID);
export default router;
