import { Schema, model, Types, FilterQuery, Document } from "mongoose";
import { createWordMatchingRegex } from "src/utils/utils";

export type TaskStatusesT = "toDo" | "inProgress" | "done";
export interface TasksSchema {
	name: string;
	description: string;
	status: TaskStatusesT;
	dueDate: Date;
	deleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetAllTaskFilters {
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

export type TasksCompleteData = TasksSchema & {
	taskId: string;
};

const tasksSchema = new Schema<TasksSchema>(
	{
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
const getTaskById = async (id: string) => {
	const task = await TasksM.findById(id);
	if (task) {
		return generateCompleteTaskData(task);
	} else {
		return null;
	}
};

const getTasksByIds = async (ids: Array<string>) => {
	const tasks = await TasksM.find({
		_id: { $in: ids.map(id => new Types.ObjectId(id)) },
	});
	return tasks.map(user => generateCompleteTaskData(user));
};

const getAllTasks = async ({
	start = 0,
	limit = 25,
	...filters
}: GetAllTaskFilters): Promise<Array<TasksCompleteData>> => {
	const query: FilterQuery<TasksSchema> = { deleted: false };
	if (filters.searchText?.trim()) {
		query.name = {
			$regex: createWordMatchingRegex(filters.searchText),
		};
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
	data: Omit<TasksSchema, "createdAt" | "updatedAt">,
) => {
	const task = new TasksM({
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
const updateUser = async ({
	taskId,
	...data
}: Partial<Omit<TasksSchema, "createdAt" | "updatedAt">> & {
	taskId: string;
}) => {
	const task = await TasksM.findById(taskId);

	if (task) {
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
		if (data.deleted !== undefined) {
			task.deleted = data.deleted;
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

export default {
	getTaskById,
	getTasksByIds,
	getAllTasks,
	insertTask,
	updateUser,
};
