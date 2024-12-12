import { Router } from "express";
import user from "./routes/user/user";
import home from "./controllers/home";

/**
 * Express router for handling all api routes.
 * @type {Router}
 */
const api: Router = Router({ mergeParams: true });

api.get("/", home.controller);

api.use("/user", user);

export default api;
