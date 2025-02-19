import { Router } from "express";
import auth from "./routes/auth/auth";
import authMiddleware from "src/middlewares/auth.middleware";
import changePassword from "./controllers/changePassword/changePassword";
import getDetails from "./controllers/getDetails/getDetails";
import getNotifications from "./controllers/getNotifications/getNotifications";
import getNotificationsCount from "./controllers/getNotificationsCount/getNotificationsCount";
import markNotificationsRead from "./controllers/markNotificationsRead/markNotificationsRead";

/**
 * Express router for handling user related routes.
 * @type {Router}
 */
const user: Router = Router({ mergeParams: true });

user.get("/", authMiddleware.signupOrLoginController, getDetails.controller);
user.get(
	"/get-notifications",
	authMiddleware.loginController,
	getNotifications.controller,
);
user.get(
	"/get-notifications-count",
	authMiddleware.loginController,
	getNotificationsCount.controller,
);
user.post(
	"/mark-notification-read",
	authMiddleware.loginController,
	markNotificationsRead.controller,
);
user.patch(
	"/change-password",
	authMiddleware.loginController,
	changePassword.validate,
	changePassword.controller,
);

user.use("/auth", auth);

export default user;
