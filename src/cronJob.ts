import "src/db/connection";
import TasksModel from "./models/tasks/Tasks.model";
import UsersNotificationsModel from "./models/users/UsersNotifications.model";
import { getMinuteDifference } from "./utils/utils";

const interval = async () => {
	let start = 0;

	const run = async () => {
		console.log("Executing notifications cron");
		const tasks = await TasksModel.getAllTasks({ start, limit: 100 });
		for (let i = 0; i < tasks.length; i++) {
			const task = tasks[i];

			if (task.status !== "done") {
				await UsersNotificationsModel.addDueOroverDue({
					userId: task.userId,
					taskId: task.taskId,
					minutesDifference: getMinuteDifference(new Date(), task.dueDate),
				});
			}
		}
		if (tasks.length === 100) {
			start += 100;
			await run();
		} else {
			console.log("Executed notifications cron");
		}
	};
	run();
};

setInterval(interval, 1000 * 60 * 60 * 8);

interval();
