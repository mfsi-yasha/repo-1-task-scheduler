import { Router } from "express";
import auth from "./routes/auth/auth";
import authMiddleware from "src/middlewares/auth.middleware";
import changePassword from "./controllers/changePassword/changePassword";

/**
 * Express router for handling user related routes.
 * @type {Router}
 */
const user: Router = Router({ mergeParams: true });

user.use("/auth", auth);

user.put(
	"/change-password",
	authMiddleware.loginController,
	changePassword.validate,
	changePassword.controller,
);

export default user;
