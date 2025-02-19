import { useState } from "react";
import styles from "./NavBar.module.scss";
import menuImg from "src/assets/images/Menu.svg";
import { Link } from "react-router";
import useLogout from "src/hooks/user/useLogout";
import Notifications from "src/features/Notifications/Notifications";
import useNotificationCount from "src/hooks/user/useNotificationCount";

/**
 * Button component for rendering navigation links in the Navbar.
 *
 * This component creates a button that links to a specified route and can
 * be styled to indicate the active state.
 *
 * @param to The route path to navigate to when the button is clicked.
 * @param text The text to display inside the button.
 * @param isActive Optional flag to indicate whether the button should be styled as active.
 * @param className Optional additional CSS class names to apply to the button.
 * @returns A navigation button component.
 */
export function NavBarButton({
	to,
	text,
	isActive = false,
	className = "",
}: {
	to: string;
	text: string;
	isActive?: boolean;
	className?: string;
}) {
	return (
		<Link
			to={to}
			className={`btn ${styles.navButton} ${isActive ? styles.active : ""} ${className}`}
		>
			{text}
		</Link>
	);
}

/**
 * Navbar component containing the application logo, menu, notifications, and logout options.
 *
 * This component renders the primary layout for the navbar, with menu buttons,
 * notifications icon, and logout functionality. It also conditionally renders the
 * notifications popup when clicked.
 *
 * @param children Child elements to render inside the navbar menu.
 * @returns A Navbar component with all associated buttons and functionality.
 */
function NavBar({ children }: { children: React.ReactNode }) {
	const [showMenu, setShowMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const handleLogout = useLogout();
	const notificationCount = useNotificationCount();

	return (
		<div
			className={`${styles.navbar} w-100 px-4 d-flex justify-content-between align-items-center`}
		>
			<div className="h3 font-weight-bold my-auto">Task Scheduler</div>
			<div className="d-flex column-gap-2">
				<div
					className={`${styles.navMenu} ${showMenu ? styles.activeMenu : ""} d-md-flex flex-row flex-md-col gap-1`}
				>
					{children}
				</div>
				<button
					className="btn d-flex d-md-none justify-content-center align-items-center"
					style={{ borderColor: "transparent" }}
					data-testid="menu-btn-element"
					onClick={() => {
						setShowMenu(v => !v);
					}}
				>
					<img
						src={menuImg}
						alt="Menu"
						loading="lazy"
						width={24}
						height={24}
					/>
				</button>
				<div className="d-flex gap-4">
					<i
						className={`${showNotifications ? "fa-solid" : "fa-regular"} fa-bell my-auto text-primary d-flex gap-2 justify-content-center align-items-center`}
						style={{ cursor: "pointer" }}
						onClick={() => {
							setShowNotifications(v => !v);
						}}
					>
						{notificationCount > 0 && (
							<span
								className="badge rounded-pill bg-danger"
								style={{
									fontSize: "0.75rem",
									padding: "0.3rem 0.6rem",
								}}
							>
								{notificationCount}
							</span>
						)}
					</i>
					<i
						className="fa-solid fa-power-off my-auto"
						style={{ cursor: "pointer" }}
						onClick={handleLogout}
					></i>
				</div>
			</div>
			{showNotifications && (
				<Notifications
					onHide={() => {
						setShowNotifications(false);
					}}
				/>
			)}
		</div>
	);
}

export default NavBar;
