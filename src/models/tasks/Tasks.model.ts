import { Schema, model, Types, FilterQuery, Document } from "mongoose";
import validator from "validator";
import { createWordMatchingRegex } from "src/utils/utils";

export type TaskStatusesT = "toDo" | "inProgress" | "done";

export interface TaskSchemaInput {
	userId: Types.ObjectId;
	name: string;
	description: string;
	status: TaskStatusesT;
	dueDate: Date;
}
export interface TasksSchema extends TaskSchemaInput {
	deleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetAllTaskFilters {
	userId: string;
	searchText?: string;
	dueDateMin?: string;
	dueDateMax?: string;
	createdDateMin?: string;
	createdDateMax?: string;
	start?: number;
	limit?: number;
}

export const taskStatuses: Array<TaskStatusesT> = [
	"toDo",
	"inProgress",
	"done",
];

type TasksDocument = Document<unknown, {}, TasksSchema> &
	TasksSchema & {
		_id: Types.ObjectId;
	};

export type TasksCompleteData = Omit<TasksSchema, "userId"> & {
	taskId: string;
	userId: string;
};

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
			maxlength: [250, "Key - name length ust be <= 250 charecters."],
			validate: {
				validator: function (v: string) {
					return v.trim().length !== 0;
				},
				message: props => `Key - name can not be empty!`,
			},
		},
		description: {
			type: String,
			required: [true, "Key - description is required."],
			trim: true,
			maxlength: [1000, "Key - description length ust be <= 1000 charecters."],
			validate: {
				validator: function (v: string) {
					return v.trim().length !== 0;
				},
				message: props => `Key - description can not be empty!`,
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
					`Key - status can not be anything other than ${JSON.stringify(taskStatuses)}!`,
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
 * Retrieve task by id.
 */
const getTaskById = async (taskId: string, userId: string) => {
	const task = await TasksM.findOne({ _id: taskId, userId, deleted: false });
	if (task) {
		return generateCompleteTaskData(task);
	} else {
		return null;
	}
};

const getTasksByIds = async (ids: Array<string>, userId: string) => {
	const tasks = await TasksM.find({
		_id: { $in: ids.map(id => new Types.ObjectId(id)) },
		userId,
		deleted: false,
	});
	return tasks.map(user => generateCompleteTaskData(user));
};

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
	if (filters.searchText !== undefined) {
		if (typeof filters.searchText !== "string") {
			errors.push("Key - searchText must be a string.");
		}
	}
	if (filters.createdDateMax !== undefined) {
		if (!validator.isDate(filters.createdDateMax)) {
			errors.push("Key - createdDateMax must be a date.");
		}
	}
	if (filters.createdDateMin !== undefined) {
		if (!validator.isDate(filters.createdDateMin)) {
			errors.push("Key - createdDateMin must be a date.");
		}
	}
	if (filters.dueDateMax !== undefined) {
		if (!validator.isDate(filters.dueDateMax)) {
			errors.push("Key - dueDateMax must be a date.");
		}
	}
	if (filters.dueDateMin !== undefined) {
		if (!validator.isDate(filters.dueDateMin)) {
			errors.push("Key - dueDateMin must be a date.");
		}
	}

	return errors;
};

const getAllTasks = async ({
	start = 0,
	limit = 25,
	...filters
}: GetAllTaskFilters): Promise<Array<TasksCompleteData>> => {
	const query: FilterQuery<TasksSchema> = {
		deleted: false,
		userId: filters.userId,
	};
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
 * Insert a new task.
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

	await task.save();
	return generateCompleteTaskData(task);
};

/**
 * Update an existing task.
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
		}
		if (data.description !== undefined) {
			task.description = data.description;
			updated = true;
		}
		if (data.status !== undefined) {
			task.status = data.status;
			updated = true;
		}
		if (data.dueDate !== undefined) {
			task.dueDate = data.dueDate;
			updated = true;
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
 * Delete task by id.
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
