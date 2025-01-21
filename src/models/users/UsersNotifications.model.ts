import { Schema, model, Types, FilterQuery, Document } from "mongoose";

export type NotificationTypes =
	| "taskCreated"
	| "taskDue"
	| "taskOverDue"
	| "taskUpdated";

export interface UsersNotificationSchema {
	userId: Types.ObjectId;
	taskId: Types.ObjectId;
	description: string;
	type: NotificationTypes;
	createdAt: Date;
}

export const notificationTypesArray: Array<NotificationTypes> = [
	"taskCreated",
	"taskDue",
	"taskOverDue",
	"taskUpdated",
];

type UsersNotificationDocument = Document<
	unknown,
	{},
	UsersNotificationSchema
> &
	UsersNotificationSchema & {
		_id: Types.ObjectId;
	};

export type UsersNotificationCompleteData = Omit<
	UsersNotificationSchema,
	"userId" | "taskId"
> & {
	notificationId: string;
	taskId: string;
	userId: string;
};

const usersNotificationSchema = new Schema<UsersNotificationSchema>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: [true, "Key - userId is required."],
		},
		taskId: {
			type: Schema.Types.ObjectId,
			required: [true, "Key - taskId is required."],
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
		type: {
			type: String,
			required: [true, "Key - type is required."],
			enum: notificationTypesArray,
			validate: {
				validator: function (v: NotificationTypes) {
					return notificationTypesArray.includes(v);
				},
				message: props =>
					`Key - status can not be anything other than ${JSON.stringify(notificationTypesArray)}!`,
			},
		},
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

const UsersNotificationM = model("UsersNotification", usersNotificationSchema);

const generateCompleteUsersNotificationData = (
	notification: UsersNotificationDocument,
) => {
	const data: UsersNotificationCompleteData = {
		notificationId: notification._id.toHexString(),
		userId: notification.userId.toHexString(),
		taskId: notification.taskId.toHexString(),
		description: notification.description,
		type: notification.type,
		createdAt: notification.createdAt,
	};
	return data;
};

/**
 * Retrieve notification by id.
 */
const getUsersNotificationById = async (
	notificationId: string,
	userId: string,
) => {
	const notification = await UsersNotificationM.findOne({
		_id: notificationId,
		userId,
	});
	if (notification) {
		return generateCompleteUsersNotificationData(notification);
	} else {
		return null;
	}
};

const getAllUsersNotification = async ({
	start = 0,
	limit = 25,
	userId,
}: {
	start: number;
	limit: number;
	userId: string;
}): Promise<Array<UsersNotificationCompleteData>> => {
	const query: FilterQuery<UsersNotificationSchema> = {
		userId: userId,
	};

	const notifications = await UsersNotificationM.find(query)
		.sort({ createdAt: -1 }) // descending order (newest first)
		.skip(start)
		.limit(limit ? limit : 25);

	return notifications.map(t => generateCompleteUsersNotificationData(t));
};

/**
 * Insert a new notification.
 */
const insertNotification = async (
	data: Omit<UsersNotificationSchema, "userId" | "taskId" | "createdAt"> & {
		userId: string;
		taskId: string;
	},
) => {
	const notification = new UsersNotificationM({
		userId: data.userId,
		taskId: data.userId,
		description: data.description,
		type: data.type,
	});

	await notification.save();
	return generateCompleteUsersNotificationData(notification);
};

const addDueOroverDue = async ({
	minutesDifference,
	...data
}: {
	userId: string;
	taskId: string;
	minutesDifference: number;
}) => {
	if (minutesDifference <= 0) {
		await insertNotification({
			...data,
			type: "taskOverDue",
			description: `Task over due by ${(Math.abs(minutesDifference) / 60).toFixed(2)} hours.`,
		});
	} else if (minutesDifference <= 24 * 60) {
		await insertNotification({
			...data,
			type: "taskDue",
			description: `Task due by ${(Math.abs(minutesDifference) / 60).toFixed(2)} hours.`,
		});
	}
};

export default {
	getUsersNotificationById,
	getAllUsersNotification,
	insertNotification,
	addDueOroverDue,
};
