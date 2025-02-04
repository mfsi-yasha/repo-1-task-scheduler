import { useState, useEffect } from "react";
import getUserNotificationsApi, {
	NotificationTypes,
	UsersNotification,
} from "src/apis/user/getUserNotifications.api";
import NoDataFound from "src/components/utility/NoDataFound/NoDataFound";
import styles from "./Notifications.module.scss";
import { useNavigate } from "react-router";

// Notification Type Labels
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

// Badge styles for each notification type
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

const Notifications = ({ onHide }: { onHide: () => void }) => {
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState<UsersNotification[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchNotifications = async (start: number, limit: number) => {
		setLoading(true);
		setError(null);

		try {
			const data = await getUserNotificationsApi({ start, limit });
			setNotifications(data);
		} catch (err) {
			setError("Failed to load notifications.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications(0, 25); // Fetch the first 10 notifications when the component mounts
	}, []);

	return (
		<div className={`rounded ${styles.notifications}`}>
			{/* Loading State */}
			{loading && (
				<div className="alert alert-info">Loading notifications...</div>
			)}

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
						className="list-group-item d-flex flex-column justify-content-between align-items-start"
						style={{ cursor: "pointer" }}
						onClick={() => {
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
		</div>
	);
};

export default Notifications;
