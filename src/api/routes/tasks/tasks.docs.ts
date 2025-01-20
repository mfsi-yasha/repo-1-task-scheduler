import { OpenAPIV3 } from "openapi-types";
import tasksGetTaskByIdDocs from "./controllers/getTaskById/tasks.getTaskById.docs";
import tasksDeleteTaskByIdDocs from "./controllers/deleteTaskById/tasks.deleteTaskById.docs";
import tasksAddTaskDocs from "./controllers/addTask/tasks.addTask.docs";
import tasksUpdateTaskDocs from "./controllers/updateTask/tasks.updateTask.docs";
import tasksGetTasksDocs from "./controllers/getTasks/tasks.getTasks.docs";

const tasksDocs: OpenAPIV3.PathsObject = {
	"/tasks/": {
		...tasksGetTasksDocs,
		...tasksAddTaskDocs,
	},
	"/tasks/{taskId}": {
		...tasksGetTaskByIdDocs,
		...tasksDeleteTaskByIdDocs,
		...tasksUpdateTaskDocs,
	},
};

export default tasksDocs;
