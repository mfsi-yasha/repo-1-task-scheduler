import "src/db/connection";
import TasksModel from "./models/tasks/Tasks.model";
import UsersNotificationsModel from "./models/users/UsersNotifications.model";
import { getMinuteDifference } from "./utils/utils";

/**
 * The interval function executes the cron job to send notifications about tasks that are not done and are overdue or due.
 * It runs every 8 hours, querying a set of tasks, checks their due date, and adds notifications to users accordingly.
 */
const interval = async () => {
	let start = 0;

	/**
	 * The main logic of the cron job that fetches tasks, checks their status, and adds notifications if necessary.
	 *
	 * It fetches tasks in batches of 100, checks if they are overdue, and if so, sends notifications to the respective users.
	 * If there are more than 100 tasks, it will continue fetching the next set of tasks recursively.
	 */
	const run = async () => {
		console.log("Executing notifications cron");

		// Fetch tasks in batches of 100
		const tasks = await TasksModel.getAllTasks({ start, limit: 100 });

		// Loop through tasks and check if they are not marked as 'done'
		for (let i = 0; i < tasks.length; i++) {
			const task = tasks[i];

			// If task is not done, check if it's overdue or due and create a notification
			if (task.status !== "done") {
				await UsersNotificationsModel.addDueOverDue({
					userId: task.userId,
					taskId: task.taskId,
					minutesDifference: getMinuteDifference(new Date(), task.dueDate),
				});
			}
		}

		// If there are more tasks to process (i.e., more than 100), fetch the next batch
		if (tasks.length === 100) {
			start += 100;
			await run();
		} else {
			console.log("Executed notifications cron");
		}
	};

	run();
};

// Set the cron job to run every 8 hours (1000ms * 60s * 60m * 8h)
setInterval(interval, 1000 * 60 * 60 * 8);

// Execute immediately when the service starts
interval();
