import { useState, useEffect, useCallback } from "react";
import getUserNotificationsApi, {
	NotificationTypes,
	UsersNotification,
} from "src/apis/user/getUserNotifications.api";
import NoDataFound from "src/components/utility/NoDataFound/NoDataFound";
import styles from "./Notifications.module.scss";
import { useNavigate } from "react-router";
import markNotificationReadApi from "src/apis/user/markNotificationRead.api";

/**
 * Maps notification types to human-readable labels.
 *
 * @param type The notification type.
 * @returns The corresponding label for the notification type.
 */
const getTypeLabel = (type: NotificationTypes) => {
	switch (type) {
		case "taskCreated":
			return "Task Created";
		case "taskDue":
			return "Task Due";
		case "taskOverDue":
			return "Task Overdue";
		case "taskUpdated":
			return "Task Updated";
		default:
			return type;
	}
};

/**
 * Maps notification types to corresponding badge styles.
 *
 * @param type The notification type.
 * @returns The class name for the badge style associated with the notification type.
 */
const getBadgeClass = (type: NotificationTypes) => {
	switch (type) {
		case "taskCreated":
			return styles.taskCreated; // Green badge for task created
		case "taskDue":
			return styles.taskDue; // Blue badge for task due
		case "taskOverDue":
			return styles.taskOverDue; // Red badge for task overdue
		case "taskUpdated":
			return styles.taskUpdated; // Yellow badge for task updated
		default:
			return "";
	}
};

const NOTIFICATION_FETCH_LIMIT = 25;

/**
 * Component to display user notifications and handle loading more notifications.
 *
 * This component fetches user notifications, displays them in a list, and allows the user to load
 * more notifications as they scroll. It also handles marking notifications as read when clicked.
 *
 * @param onHide A callback to close the notifications list when a notification is clicked.
 * @returns JSX element to render the notifications list.
 */
const Notifications = ({ onHide }: { onHide: () => void }) => {
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState<UsersNotification[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Fetches notifications starting from a specific index and appends them to the current list.
	 *
	 * @param start The starting index for fetching notifications.
	 */
	const fetchNotifications = useCallback(async (start: number) => {
		setLoading(true);
		setError(null);

		try {
			const data = await getUserNotificationsApi({
				start,
				limit: NOTIFICATION_FETCH_LIMIT,
			});
			setNotifications(v => [...v, ...data]);
			if (data.length < NOTIFICATION_FETCH_LIMIT) {
				setHasMore(false);
			}
		} catch (err) {
			setError("Failed to load notifications.");
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Loads more notifications if available.
	 */
	const handleLoadMore = useCallback(() => {
		if (hasMore) {
			fetchNotifications(notifications.length);
		}
	}, [hasMore, notifications]);

	/**
	 * Marks a notification as read.
	 *
	 * @param notificationId The ID of the notification to mark as read.
	 */
	const markNotificationRead = useCallback((notificationId: string) => {
		markNotificationReadApi({ notificationId });
	}, []);

	useEffect(() => {
		fetchNotifications(0);
	}, []);

	return (
		<div className={`rounded ${styles.notifications}`}>
			{/* Error State */}
			{error && <div className="alert alert-danger">{error}</div>}

			{/* No Notifications */}
			{notifications.length === 0 && !loading && !error && (
				<NoDataFound text="No notifications found." />
			)}

			{/* Notifications List */}
			<ul className="list-group">
				{notifications.map(notification => (
					<li
						key={notification.notificationId}
						className={`mb-2 rounded list-group-item d-flex flex-column justify-content-between align-items-start ${notification.isRead ? "" : styles.activeNotification}`}
						style={{ cursor: "pointer" }}
						onClick={() => {
							markNotificationRead(notification.notificationId);
							navigate(`/task/${notification.taskId}`);
							onHide();
						}}
					>
						<div className="w-100 mb-2 d-flex justify-content-between align-items-baseline">
							<span
								className={`badge ${getBadgeClass(notification.type)}`}
								style={{ marginRight: "8px" }}
							>
								{getTypeLabel(notification.type)}
							</span>
							<small className="text-muted">
								{new Date(notification.createdAt).toLocaleString()}
							</small>
						</div>
						{/* Description */}
						<div className="mb-0">
							<strong>Task Id: </strong>
							<i>{notification.taskId}</i>
						</div>
						<div>{notification.description}</div>
					</li>
				))}
			</ul>
			<div className="d-flex justify-content-center">
				{loading ? (
					<div
						className="spinner-border spinner-border-sm text-primary"
						role="status"
					>
						<span className="sr-only">Loading...</span>
					</div>
				) : hasMore ? (
					<button
						className="btn btn-primary mt-3"
						onClick={handleLoadMore}
					>
						<i className="fa fa-arrow-down"></i> Load More
					</button>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default Notifications;
