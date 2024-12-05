import { Router } from "express";
import home from "./controllers/home";

/**
 * Express router for handling all api routes.
 * @type {Router}
 */
const api: Router = Router({ mergeParams: true });

api.get("/", home.controller);

export default api;
