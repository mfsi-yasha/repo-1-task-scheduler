import { axiosJSON, ResponseDataType } from "src/globals/axiosInstances";

export type NotificationTypes =
	| "taskCreated"
	| "taskDue"
	| "taskOverDue"
	| "taskUpdated";

export interface UsersNotification {
	notificationId: string;
	userId: string;
	taskId: string;
	description: string;
	type: NotificationTypes;
	createdAt: string;
}

export interface GetNotificationsParams {
	start: number;
	limit: number;
}

export default async function (params: GetNotificationsParams) {
	const { data: res } = await axiosJSON.get<
		ResponseDataType<Array<UsersNotification>>
	>("/user/get-notifications", { params });

	if (res.err) {
		throw new Error(res.msg ?? "Something went wrong!");
	} else {
		return res.data;
	}
}
