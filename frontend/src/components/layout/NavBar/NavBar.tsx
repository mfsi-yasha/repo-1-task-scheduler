import { useState } from "react";
import styles from "./NavBar.module.scss";
import menuImg from "src/assets/images/Menu.svg";
import { Link } from "react-router";

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

function NavBar({ children }: { children: React.ReactNode }) {
	const [showMenu, setShowMenu] = useState(false);

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
						alt=""
						loading="lazy"
						width={24}
						height={24}
					/>
				</button>
				<i className="fa-regular fa-bell my-auto"></i>
			</div>
		</div>
	);
}

export default NavBar;
