import { Router } from "express";
import authMiddleware from "src/middlewares/auth.middleware";
import getTasks from "./controllers/getTasks/getTasks";
import getTaskById from "./controllers/getTaskById/getTaskById";
import deleteTaskById from "./controllers/deleteTaskById/deleteTaskById";
import updateTask from "./controllers/updateTask/updateTask";
import addTask from "./controllers/addTask/addTask";

/**
 * Express router for handling user related routes.
 * @type {Router}
 */
const tasks: Router = Router({ mergeParams: true });

tasks.get("/", authMiddleware.loginController, getTasks.controller);
tasks.post("/", authMiddleware.loginController, addTask.controller);
tasks.patch("/:taskId", authMiddleware.loginController, updateTask.controller);
tasks.get("/:taskId", authMiddleware.loginController, getTaskById.controller);
tasks.delete(
	"/:taskId",
	authMiddleware.loginController,
	deleteTaskById.controller,
);

export default tasks;
