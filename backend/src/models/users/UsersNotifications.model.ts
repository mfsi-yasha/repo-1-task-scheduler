import { Schema, model, Types, FilterQuery, Document } from "mongoose";

// Notification types that the system supports
export type NotificationTypes =
	| "taskCreated"
	| "taskDue"
	| "taskOverDue"
	| "taskUpdated";

// The structure of a user's notification document in the database
export interface UsersNotificationSchema {
	userId: Types.ObjectId; // ID of the user this notification is for
	taskId: Types.ObjectId; // ID of the associated task
	description: string; // Description of the notification (e.g., task status update)
	type: NotificationTypes; // Type of notification (e.g., task created, task overdue)
	isRead: boolean; // Whether the notification has been read
	createdAt: Date; // Timestamp when the notification was created
}

// Supported notification types
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

// Final data format for returning notifications to the user (converted to string IDs)
export type UsersNotificationCompleteData = Omit<
	UsersNotificationSchema,
	"userId" | "taskId"
> & {
	notificationId: string; // ID of the notification as a string
	taskId: string; // ID of the associated task as a string
	userId: string; // ID of the user as a string
};

// Mongoose schema for the notification model
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
			maxlength: [1000, "Key - description length must be <= 1000 characters."],
			validate: {
				validator: function (v: string) {
					return v.trim().length !== 0; // Description cannot be empty
				},
				message: props => `Key - description cannot be empty!`,
			},
		},
		type: {
			type: String,
			required: [true, "Key - type is required."],
			enum: notificationTypesArray, // Ensures that the type is one of the allowed notification types
			validate: {
				validator: function (v: NotificationTypes) {
					return notificationTypesArray.includes(v); // Ensures the type is valid
				},
				message: props =>
					`Key - type cannot be anything other than ${JSON.stringify(
						notificationTypesArray,
					)}!`,
			},
		},
		isRead: {
			type: Boolean,
			required: [true, "Key - isRead is required."],
		},
	},
	{ timestamps: { createdAt: true, updatedAt: false } }, // Only store createdAt timestamp, not updatedAt
);

// Mongoose model for the users notifications collection
const UsersNotificationM = model("UsersNotification", usersNotificationSchema);

// Helper function to generate complete notification data with string IDs
const generateCompleteUsersNotificationData = (
	notification: UsersNotificationDocument,
) => {
	const data: UsersNotificationCompleteData = {
		notificationId: notification._id.toHexString(),
		userId: notification.userId.toHexString(),
		taskId: notification.taskId.toHexString(),
		description: notification.description,
		type: notification.type,
		isRead: notification.isRead,
		createdAt: notification.createdAt,
	};
	return data;
};

/**
 * Retrieve a notification by its ID for a specific user.
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
		return generateCompleteUsersNotificationData(notification); // Return the notification with complete data
	} else {
		return null; // Return null if no notification is found
	}
};

/**
 * Retrieve all notifications for a specific user with pagination.
 */
const getAllUsersNotification = async ({
	start = 0,
	limit = 25,
	userId,
}: {
	start: number; // The starting index for pagination
	limit: number; // The number of notifications to retrieve
	userId: string; // The ID of the user whose notifications are being fetched
}): Promise<Array<UsersNotificationCompleteData>> => {
	const query: FilterQuery<UsersNotificationSchema> = {
		userId: userId, // Only fetch notifications for the specified user
	};

	const notifications = await UsersNotificationM.find(query)
		.sort({ createdAt: -1 }) // Sort the notifications in descending order (newest first)
		.skip(start) // Skip to the specified starting index
		.limit(limit ? limit : 25); // Limit the number of notifications

	return notifications.map(t => generateCompleteUsersNotificationData(t)); // Map notifications to complete data format
};

/**
 * Insert a new notification into the database.
 */
const insertNotification = async (
	data: Omit<
		UsersNotificationSchema,
		"userId" | "taskId" | "createdAt" | "isRead"
	> & {
		userId: string;
		taskId: string;
	},
) => {
	const notification = new UsersNotificationM({
		userId: data.userId,
		taskId: data.taskId,
		description: data.description,
		type: data.type,
		isRead: false, // Set the initial state of the notification as unread
	});

	await notification.save(); // Save the new notification to the database
	return generateCompleteUsersNotificationData(notification); // Return the newly created notification in complete data format
};

/**
 * Add "taskDue" or "taskOverDue" notifications based on the time difference between current time and task's due date.
 */
const addDueOverDue = async ({
	minutesDifference,
	...data
}: {
	userId: string;
	taskId: string;
	minutesDifference: number; // Time difference in minutes between current time and the task's due date
}) => {
	if (minutesDifference <= 0) {
		// If the task is overdue
		await insertNotification({
			...data,
			type: "taskOverDue", // Set the notification type to "taskOverDue"
			description: `Task overdue by ${(
				Math.abs(minutesDifference) / 60
			).toFixed(2)} hours.`, // Generate a description based on the minutes difference
		});
	} else if (minutesDifference <= 24 * 60) {
		// If the task is due within 24 hours
		await insertNotification({
			...data,
			type: "taskDue", // Set the notification type to "taskDue"
			description: `Task due in ${(Math.abs(minutesDifference) / 60).toFixed(
				2,
			)} hours.`, // Generate a description based on the minutes difference
		});
	}
};

/**
 * Mark a notification as read.
 */
const markAsRead = async ({
	notificationId,
	userId,
}: {
	notificationId: string; // The ID of the notification to mark as read
	userId: string; // The user who owns the notification
}) => {
	const notification = await UsersNotificationM.findOne({
		_id: notificationId,
		userId,
	});
	if (notification) {
		notification.isRead = true; // Mark the notification as read
		await notification.save(); // Save the updated notification
	}
};

/**
 * Get the count of unread notifications for a user.
 */
const getUnreadCount = async ({ userId }: { userId: string }) => {
	return await UsersNotificationM.countDocuments({ userId, isRead: false }); // Count the number of unread notifications
};

export default {
	getUsersNotificationById,
	getAllUsersNotification,
	insertNotification,
	addDueOverDue,
	markAsRead,
	getUnreadCount,
};
