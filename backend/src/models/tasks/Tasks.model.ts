import { Schema, model, Types, FilterQuery, Document } from "mongoose";
import validator from "validator";
import { createWordMatchingRegex, getMinuteDifference } from "src/utils/utils";
import UsersNotificationsModel from "../users/UsersNotifications.model";

// Define task statuses as type
export type TaskStatusesT = "toDo" | "inProgress" | "done";

// Define the structure for the input to create a task
export interface TaskSchemaInput {
	userId: Types.ObjectId; // The ID of the user who owns the task
	name: string; // The name of the task
	description: string; // Description of the task
	status: TaskStatusesT; // The current status of the task
	dueDate: Date; // The due date for the task
}

// Define the structure for tasks in the database, including metadata
export interface TasksSchema extends TaskSchemaInput {
	deleted: boolean; // Flag to mark if the task is deleted
	createdAt: Date; // Timestamp of when the task was created
	updatedAt: Date; // Timestamp of the last update of the task
}

// Filters for retrieving tasks
export interface GetAllTaskFilters {
	userId?: string; // Optional user ID filter
	searchText?: string; // Optional text search for task name or description
	dueDateMin?: string; // Optional filter for tasks with due dates after this date
	dueDateMax?: string; // Optional filter for tasks with due dates before this date
	createdDateMin?: string; // Optional filter for tasks created after this date
	createdDateMax?: string; // Optional filter for tasks created before this date
	start?: number; // Optional pagination start index
	limit?: number; // Optional pagination limit (max 25)
}

// List of possible task statuses
export const taskStatuses: Array<TaskStatusesT> = [
	"toDo",
	"inProgress",
	"done",
];

// Labels for each task status
export const taskStatusesLabels: Record<TaskStatusesT, string> = {
	toDo: "To Do",
	inProgress: "In Progress",
	done: "Done",
};

type TasksDocument = Document<unknown, {}, TasksSchema> &
	TasksSchema & {
		_id: Types.ObjectId;
	};

// Represents a task with complete data for a user
export type TasksCompleteData = Omit<TasksSchema, "userId"> & {
	taskId: string; // The task ID
	userId: string; // The user ID associated with the task
};

// Define Mongoose schema for tasks
const tasksSchema = new Schema<TasksSchema>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: [true, "Key - userId is required."],
		},
		name: {
			type: String,
			required: [true, "Key - name is required."],
			trim: true,
			maxlength: [250, "Key - name length must be <= 250 characters."],
			validate: {
				validator: function (v: string) {
					return v.trim().length !== 0;
				},
				message: props => `Key - name cannot be empty!`,
			},
		},
		description: {
			type: String,
			required: [true, "Key - description is required."],
			trim: true,
			maxlength: [1000, "Key - description length must be <= 1000 characters."],
			validate: {
				validator: function (v: string) {
					return v.trim().length !== 0;
				},
				message: props => `Key - description cannot be empty!`,
			},
		},
		status: {
			type: String,
			required: [true, "Key - status is required."],
			enum: taskStatuses,
			validate: {
				validator: function (v: TaskStatusesT) {
					return taskStatuses.includes(v);
				},
				message: props =>
					`Key - status cannot be anything other than ${JSON.stringify(taskStatuses)}!`,
			},
		},
		dueDate: {
			type: Date,
			required: [true, "Key - dueDate is required."],
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const TasksM = model("Tasks", tasksSchema);

/**
 * Generate complete task data for a user (includes taskId and userId as strings)
 */
const generateCompleteTaskData = (task: TasksDocument) => {
	const data: TasksCompleteData = {
		taskId: task._id.toHexString(),
		userId: task.userId.toHexString(),
		name: task.name,
		description: task.description,
		status: task.status,
		dueDate: task.dueDate,
		deleted: task.deleted,
		createdAt: task.createdAt,
		updatedAt: task.updatedAt,
	};
	return data;
};

/**
 * Retrieve a task by its ID for a specific user.
 */
const getTaskById = async (taskId: string, userId: string) => {
	const task = await TasksM.findOne({ _id: taskId, userId, deleted: false });
	if (task) {
		return generateCompleteTaskData(task);
	} else {
		return null;
	}
};

/**
 * Retrieve multiple tasks by their IDs for a specific user.
 */
const getTasksByIds = async (ids: Array<string>, userId: string) => {
	const tasks = await TasksM.find({
		_id: { $in: ids.map(id => new Types.ObjectId(id)) },
		userId,
		deleted: false,
	});
	return tasks.map(user => generateCompleteTaskData(user));
};

/**
 * Validate task filters for pagination, date ranges, and search text.
 */
const validateFilters = (filters: GetAllTaskFilters) => {
	const errors: Array<string> = [];

	if (filters.start !== undefined) {
		if (
			typeof parseInt(filters.start + "") === "number"
				? filters.start < 0
					? true
					: false
				: true
		) {
			errors.push("Key - start must be a number and >= 0.");
		} else {
			filters.start = parseInt(filters.start + "");
		}
	}

	// Validate limit filter (max 25 tasks per page)
	if (filters.limit !== undefined) {
		if (
			typeof parseInt(filters.limit + "") === "number"
				? filters.limit <= 0 || filters.limit > 25
					? true
					: false
				: true
		) {
			errors.push("Key - limit must be a number and > 0 and <= 25.");
		} else {
			filters.limit = parseInt(filters.limit + "");
		}
	}

	// Validate date filters and search text
	if (filters.searchText !== undefined) {
		if (typeof filters.searchText !== "string") {
			errors.push("Key - searchText must be a string.");
		}
	}
	if (
		filters.createdDateMax !== undefined &&
		!validator.isDate(filters.createdDateMax)
	) {
		errors.push("Key - createdDateMax must be a date.");
	}
	if (
		filters.createdDateMin !== undefined &&
		!validator.isDate(filters.createdDateMin)
	) {
		errors.push("Key - createdDateMin must be a date.");
	}
	if (
		filters.dueDateMax !== undefined &&
		!validator.isDate(filters.dueDateMax)
	) {
		errors.push("Key - dueDateMax must be a date.");
	}
	if (
		filters.dueDateMin !== undefined &&
		!validator.isDate(filters.dueDateMin)
	) {
		errors.push("Key - dueDateMin must be a date.");
	}

	return errors;
};

/**
 * Get all tasks based on filters such as date range, search text, etc.
 */
const getAllTasks = async ({
	start = 0,
	limit = 25,
	...filters
}: GetAllTaskFilters): Promise<Array<TasksCompleteData>> => {
	const query: FilterQuery<TasksSchema> = {
		deleted: false,
	};
	if (filters.userId) {
		query.userId = filters.userId;
	}
	if (filters.searchText?.trim()) {
		query["$or"] = [
			{
				name: {
					$regex: createWordMatchingRegex(filters.searchText),
				},
			},
			{
				description: {
					$regex: createWordMatchingRegex(filters.searchText),
				},
			},
		];
	}
	if (filters.createdDateMin || filters.createdDateMax) {
		query.createdAt = {};
		if (filters.createdDateMin) {
			query.createdAt["$gte"] = filters.createdDateMin;
		}
		if (filters.createdDateMax) {
			query.createdAt["$lte"] = filters.createdDateMax;
		}
	}
	if (filters.dueDateMin || filters.dueDateMax) {
		query.createdAt = {};
		if (filters.dueDateMin) {
			query.createdAt["$gte"] = filters.dueDateMin;
		}
		if (filters.dueDateMax) {
			query.createdAt["$lte"] = filters.dueDateMax;
		}
	}

	const tasks = await TasksM.find(query)
		.skip(start)
		.limit(limit ? limit : 25);

	return tasks.map(t => generateCompleteTaskData(t));
};

/**
 * Insert a new task into the database and send notifications to the user.
 */
const insertTask = async (
	data: Omit<TaskSchemaInput, "userId"> & { userId: string },
) => {
	const task = new TasksM({
		userId: data.userId,
		name: data.name,
		description: data.description,
		dueDate: data.dueDate,
		status: data.status,
		deleted: false,
	});

	await UsersNotificationsModel.insertNotification({
		userId: data.userId,
		taskId: task._id.toHexString(),
		type: "taskCreated",
		description: task.name,
	});

	// If task is not done, add due/overdue notification
	if (task.status !== "done") {
		await UsersNotificationsModel.addDueOverDue({
			userId: data.userId,
			taskId: task._id.toHexString(),
			minutesDifference: getMinuteDifference(new Date(), task.dueDate),
		});
	}

	await task.save();
	return generateCompleteTaskData(task);
};

/**
 * Update an existing task and notify the user of changes.
 */
const updateTask = async ({
	taskId,
	userId,
	...data
}: Partial<Omit<TaskSchemaInput, "userId">> & {
	taskId: string;
	userId: string;
}) => {
	const task = await TasksM.findById(taskId);

	if (task?.userId?.toHexString() === userId) {
		let updated = false;

		if (data.name !== undefined) {
			task.name = data.name;
			updated = true;
			await UsersNotificationsModel.insertNotification({
				userId: userId,
				taskId: taskId,
				type: "taskUpdated",
				description: `Task name updated.`,
			});
		}
		if (data.description !== undefined) {
			task.description = data.description;
			updated = true;
			await UsersNotificationsModel.insertNotification({
				userId: userId,
				taskId: taskId,
				type: "taskUpdated",
				description: `Task description updated.`,
			});
		}
		if (data.status !== undefined) {
			const oldStatus = task.status;
			task.status = data.status;
			updated = true;
			await UsersNotificationsModel.insertNotification({
				userId: userId,
				taskId: taskId,
				type: "taskUpdated",
				description: `Task status updated from ${taskStatusesLabels[oldStatus]} to ${taskStatusesLabels[task.status]}`,
			});
		}
		if (data.dueDate !== undefined) {
			const oldDueDate = task.dueDate;
			task.dueDate = data.dueDate;
			updated = true;
			await UsersNotificationsModel.insertNotification({
				userId: userId,
				taskId: taskId,
				type: "taskUpdated",
				description: `Task due date updated from ${oldDueDate.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })} to ${task.dueDate.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric" })}`,
			});

			if (task.status !== "done") {
				await UsersNotificationsModel.addDueOverDue({
					userId: userId,
					taskId: taskId,
					minutesDifference: getMinuteDifference(new Date(), task.dueDate),
				});
			}
		}

		if (updated) {
			await task.save();
			return generateCompleteTaskData(task);
		} else {
			throw new Error("Nothing to update!");
		}
	} else {
		throw new Error(`Task not found for taskId: ${taskId}`);
	}
};

/**
 * Mark a task as deleted.
 */
const deleteTaskById = async (id: string) => {
	const task = await TasksM.findById(id);
	if (task) {
		task.deleted = true;
		await task.save();
	}
};

export default {
	getTaskById,
	getTasksByIds,
	validateFilters,
	getAllTasks,
	insertTask,
	updateTask,
	deleteTaskById,
};
