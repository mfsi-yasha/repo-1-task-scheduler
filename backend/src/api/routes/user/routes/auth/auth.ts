import { Router } from "express";
import signup from "./controllers/signup/signup";
import login from "./controllers/login/login";
import resetPassword from "./controllers/resetPassword/resetPassword";
import verifyUser from "./controllers/verifyUser/verifyUser";
import resendOTP from "./controllers/resendOTP/resendOTP";
import authMiddleware from "src/middlewares/auth.middleware";
import logout from "./controllers/logout/logout";
import requestResetPassword from "./controllers/requestResetPassword/requestResetPassword";

/**
 * Express router for handling user/auth related routes.
 * @type {Router}
 */
const auth: Router = Router({ mergeParams: true });

auth.post("/login", login.validate, login.controller);

auth.post("/signup", signup.validate, signup.controller);

auth.post(
	"/request-reset-password",
	requestResetPassword.validate,
	requestResetPassword.controller,
);

auth.post(
	"/resend-otp/reset-password",
	authMiddleware.resetPasswordController,
	resendOTP.controller,
);

auth.post(
	"/resend-otp/signup",
	authMiddleware.signupController,
	resendOTP.controller,
);

auth.patch(
	"/reset-password",
	authMiddleware.resetPasswordController,
	resetPassword.validate,
	resetPassword.controller,
);

auth.post(
	"/verify-user",
	authMiddleware.signupController,
	verifyUser.validate,
	verifyUser.controller,
);

auth.post("/logout", authMiddleware.logoutController, logout.controller);

export default auth;
